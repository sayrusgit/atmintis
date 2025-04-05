import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { List } from '@entities/list.schema';
import { User } from '@entities/user.schema';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true })
export class Entry {
  @Prop({ required: true })
  orderPosition: number;

  @Prop({ required: true, index: true, trim: true })
  value: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop()
  type: string;

  @Prop([String])
  tags: string[];

  @Prop(
    raw([
      {
        value: { type: 'string' },
        color: { type: 'string' },
      },
    ]),
  )
  extra: string[];

  @Prop()
  collections: string[];

  @Prop({ default: '' })
  image: string;

  @Prop({ default: 1000, max: 2000, min: 0 })
  confidenceScore: number;

  @Prop({ type: Date, default: null })
  lastExercise: Date;

  @Prop({ index: true, type: mongoose.Schema.Types.ObjectId, ref: 'List' })
  list: List;

  @Prop({
    index: true,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  createdAt: Date;
  updatedAt: Date;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
