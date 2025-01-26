import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Entry } from '@entities/entry.schema';
import { User } from '@entities/user.schema';

export type DefinitionDocument = HydratedDocument<Definition>;

@Schema()
export class Definition {
  @Prop({ required: true })
  description: string;

  @Prop([String])
  examples: string[];

  @Prop([String])
  prefixes: string[];

  @Prop(
    raw([
      {
        value: { type: 'string' },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
      },
    ]),
  )
  synonyms: Record<string, any>[];

  @Prop(
    raw([
      {
        value: { type: 'string' },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
      },
    ]),
  )
  opposites: Record<string, any>[];

  @Prop(
    raw([
      {
        value: { type: 'string' },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
      },
    ]),
  )
  compares: Record<string, any>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' })
  parentEntry: Entry;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const DefinitionSchema = SchemaFactory.createForClass(Definition);
