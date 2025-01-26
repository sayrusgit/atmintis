import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '@constants/index';
import { IsEnum } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  @IsEnum(Role)
  role: Role;

  @Prop(
    raw({
      isEnabled: { type: Boolean },
      secret: { type: String },
      tempSecret: { type: String },
    }),
  )
  mfa: {
    isEnabled: boolean;
    secret: string;
    tempSecret: string;
  };

  @Prop()
  profilePicture: string;

  @Prop()
  refreshToken: string;

  @Prop()
  spaces: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
