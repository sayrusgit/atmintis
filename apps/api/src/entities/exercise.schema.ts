import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@entities/user.schema';
import { List } from '@entities/list.schema';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true })
  list: List;

  @Prop(
    raw([
      {
        value: { type: 'string' },
        description: { type: 'string' },
        confidenceScore: { type: 'number' },
        lastExercise: { type: 'Date' },
        image: { type: 'string' },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
      },
    ]),
  )
  entries: Record<string, any>[];

  @Prop()
  totalEntries: number;

  @Prop(
    raw({
      value: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string' },
      confidenceScore: { type: 'number' },
      lastExercise: { type: 'Date' },
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
    }),
  )
  ongoingEntry: Record<string, any>;

  @Prop({ default: 0 })
  ongoingEntryIndex: number;

  @Prop({ default: 0 })
  hintsUsed: number;

  @Prop({ default: 0 })
  imagesRevealed: number;

  @Prop({ default: false })
  isFinished: boolean;

  @Prop()
  isSkipped: boolean;

  @Prop({ default: 0 })
  positiveAnswersCount: number;

  @Prop({ type: Date })
  finishedAt: Date;

  @Prop()
  sessionTime: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
