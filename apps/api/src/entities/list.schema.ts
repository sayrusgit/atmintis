import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@entities/user.schema';

export type ListDocument = HydratedDocument<List>;

@Schema({ timestamps: true })
export class List {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  entryNumber: number;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({ required: true, default: true })
  isPrivate: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ListSchema = SchemaFactory.createForClass(List);
