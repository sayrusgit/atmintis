import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PracticeSession, PracticeSessionDocument } from '@entities/practice-session.schema';
import { EntriesService } from '@components/data/services/entries.service';
import { Redis } from '@upstash/redis';
import { IPracticeSession, IResponse } from '@shared/types';
import { PracticeResponseDto } from '@components/practice/dtos/practice.dto';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(PracticeSession.name)
    private practiceSessionModel: Model<PracticeSession>,
    private entriesService: EntriesService,
  ) {}

  redis = Redis.fromEnv();

  async getPracticeSessions(): Promise<PracticeSessionDocument[]> {
    const res = await this.practiceSessionModel.find();

    return res;
  }

  async getPracticeSession(id: string): Promise<PracticeSession> {
    const res = await this.practiceSessionModel.findOne({ _id: id });

    return res;
  }

  async getPracticeSessionRedis(id: string): Promise<IPracticeSession> {
    const res = await this.redis.get<IPracticeSession>(id);
    if (!res) throw new NotFoundException('No practice session found');

    return res;
  }

  async getPracticeSessionByList(id: string): Promise<PracticeSession> {
    const res = await this.practiceSessionModel.findOne({ list: id });
    if (!res) throw new NotFoundException('No practice session found');

    return res;
  }

  async startListPracticeSession(
    userId: string,
    listId: string,
  ): Promise<IResponse<PracticeSessionDocument>> {
    const entriesRaw = await this.entriesService.getEntriesByListRandomized(listId);
    const entries = entriesRaw.map((entry) => ({
      value: entry.value,
      description: entry.description,
      image: entry.image,
      id: entry._id,
    }));

    if (!entries.length)
      return {
        success: false,
        message: `You can't start a practice session without entries`,
        response: null,
      };

    const res = await this.practiceSessionModel.create({
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

  async practiceResponse(sessionId: string, data: PracticeResponseDto) {
    const session = await this.redis.get<IPracticeSession>(sessionId);

    if (data.isHintUsed) session.hintsUsed++;
    if (data.isImageRevealed) session.imagesRevealed++;
    if (data.isCorrectAnswer === true) session.correctAnswersCount++;
    session.ongoingEntry = session.entries[data.nextEntryIndex];
    session.ongoingEntryIndex = data.nextEntryIndex;

    const res = await this.redis.set(sessionId, session);

    return res;
  }

  async finishPracticeSession(sessionId: string, isSkipped: boolean): Promise<IResponse<any>> {
    const session = await this.redis.get<IPracticeSession>(sessionId);
    await this.redis.del(sessionId);

    const startedAt = new Date(session.createdAt).getTime();
    const finishedAt = new Date().getTime();

    const res = await this.practiceSessionModel.updateOne(
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
