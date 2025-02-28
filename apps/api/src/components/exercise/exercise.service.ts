import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntriesService } from '@components/data/services/entries.service';
import { Redis } from '@upstash/redis';
import { Exercise, ExerciseDocument } from '@entities/exercise.schema';
import { IExercise, IExerciseEntry, IResponse } from '@shared/types';
import { ExerciseResponseDto } from '@components/exercise/dtos/exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name)
    private exerciseModel: Model<Exercise>,
    private entriesService: EntriesService,
  ) {}

  redis = Redis.fromEnv();

  async getExercises(): Promise<ExerciseDocument[]> {
    return this.exerciseModel.find();
  }

  async getExercise(id: string): Promise<ExerciseDocument> {
    return this.exerciseModel.findOne({ _id: id });
  }

  async getExerciseRedis(id: string): Promise<IExercise> {
    const res = await this.redis.get<IExercise>(id);
    if (!res) throw new NotFoundException('No practice session found');

    return res;
  }

  async getExerciseByList(id: string): Promise<ExerciseDocument> {
    const res = await this.exerciseModel.findOne({ list: id });
    if (!res) throw new NotFoundException('No practice session found');

    return res;
  }

  async startExercise(userId: string, listId: string): Promise<IResponse<ExerciseDocument>> {
    const entriesRaw = await this.entriesService.getEntriesByListRandomized(listId);
    const entries = entriesRaw.map((entry) => ({
      value: entry.value,
      description: entry.description,
      image: entry.image,
      confidenceScore: entry.confidenceScore,
      lastExercise: entry.lastExercise,
      id: String(entry._id),
    }));

    if (!entries.length)
      return {
        success: false,
        message: `You can't start a practice session without entries`,
        response: null,
      };

    const res = await this.exerciseModel.create({
      user: userId,
      list: listId,
      entries,
      ongoingEntry: entries[0],
      totalEntries: entries.length,
    });

    const expiresIn6Hours = 6 * 60 * 60 * 1000;

    await this.redis.set(String(res._id), res, { px: expiresIn6Hours });

    return {
      success: true,
      message: 'Practice session has started',
      response: res,
    };
  }

  async exerciseResponse(sessionId: string, data: ExerciseResponseDto) {
    const session = await this.redis.get<IExercise>(sessionId);

    const updatedConfidence = this.calculateConfidenceGain(
      session.ongoingEntry,
      data.isPositive,
      data.isImageRevealed,
    );

    await this.entriesService.updateEntry(session.ongoingEntry.id, {
      confidence: updatedConfidence,
      lastPracticeSessionDate: new Date(),
    });

    if (data.isHintUsed) session.hintsUsed++;
    if (data.isImageRevealed) session.imagesRevealed++;
    if (data.isPositive === true) session.positiveAnswersCount++;
    session.ongoingEntry = session.entries[data.nextEntryIndex];
    session.ongoingEntryIndex = data.nextEntryIndex;

    return await this.redis.set(sessionId, session);
  }

  private calculateConfidenceGain(entry: IExerciseEntry, isPositive: boolean, isHintUsed: boolean) {
    let baseConfidenceGain = isPositive ? 100 : -100;
    if (isHintUsed) baseConfidenceGain *= 1.3;

    // Declare corresponding data
    const lastExerciseTimestamp = entry?.lastExercise ? new Date(entry.lastExercise).getTime() : 0;
    const sinceLastExercise = lastExerciseTimestamp ? Date.now() - lastExerciseTimestamp : 0;

    const lastExerciseAsPercentageOfTwoWeeks = sinceLastExercise / 1209600000;

    // Calculate time-based confidence scaling
    const confidenceScalingCoefficient =
      baseConfidenceGain * Math.min(lastExerciseAsPercentageOfTwoWeeks, 0.9);

    // Compute new confidence value
    const confidenceChange = Math.floor(
      entry.confidenceScore + baseConfidenceGain + confidenceScalingCoefficient,
    );
    return Math.min(confidenceChange, 2000);
  }

  async finishExercise(sessionId: string, isSkipped: boolean): Promise<IResponse<any>> {
    const session = await this.redis.get<IExercise>(sessionId);
    await this.redis.del(sessionId);

    const startedAt = new Date(session.createdAt).getTime();
    const finishedAt = new Date().getTime();

    const res = await this.exerciseModel.updateOne(
      { _id: sessionId },
      {
        ...session,
        isFinished: true,
        finishedAt,
        sessionTime: finishedAt - startedAt,
        isSkipped,
      },
    );

    return {
      success: true,
      message: 'Practice session has finished',
      response: res,
    };
  }
}
