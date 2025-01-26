import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Definition } from '@entities/definition.schema';
import { List } from '@entities/list.schema';
import { User } from '@entities/user.schema';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true })
export class Entry {
  @Prop({ required: true, index: true })
  value: string;

  @Prop({ required: true })
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
  context: string[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Definition' }])
  definitions: Definition[];

  @Prop()
  idioms: string[];

  @Prop()
  collections: string[];

  @Prop({ default: '' })
  image: string;

  @Prop({ index: true, type: mongoose.Schema.Types.ObjectId, ref: 'List' })
  list: List;

  @Prop({
    index: true,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
