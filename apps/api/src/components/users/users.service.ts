import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { DeleteResult, Model, UpdateWriteOpResult } from 'mongoose';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from '@components/users/dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { removeFile } from '@helpers/RemoveFile';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { User, UserDocument } from '@entities/user.schema';
import { ListsService } from '@components/data/services/lists.service';
import { validateId } from '@helpers/ValidateId';
import { IError, IMfaPayload, IResponse, Locale } from '@shared/types';
import { DefinitionsService } from '@components/data/services/definitions.service';
import { EntriesService } from '@components/data/services/entries.service';
import { Resend } from 'resend';
import * as process from 'node:process';
import { IJwtPayload } from '@constants/index';
import { ExerciseService } from '@components/exercise/exercise.service';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private listsService: ListsService,
    private definitionsService: DefinitionsService,
    private entriesService: EntriesService,
    private exerciseService: ExerciseService,
  ) {}

  resend = new Resend(process.env.RESEND_TOKEN);

  async getUsers(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async getUserByName(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async getUserByNameOrEmail(login: string): Promise<UserDocument> {
    return this.userModel.findOne({
      $or: [{ email: login }, { username: login }],
    });
  }

  async getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async createUser(data: CreateUserDto, profilePicture: string): Promise<UserDocument> {
    const isUsernameUsed = await this.getUserByName(data.username);
    if (isUsernameUsed) throw new BadRequestException('Username is already taken');

    const isEmailUsed = await this.getUserByEmail(data.email);
    if (isEmailUsed) throw new BadRequestException('Email is already used');

    const hashedPassword = await bcrypt.hash(data.password, 7);

    const res = await this.userModel.create({
      ...data,
      password: hashedPassword,
      mfa: {
        isEnabled: false,
        secret: '',
        tempSecret: '',
      },
      profilePicture: profilePicture || '',
    });

    await this.listsService.createList({
      userId: String(res._id),
      title: 'Your entries',
      isDefault: true,
    });

    return res;
  }

  async initializeEmailVerification(userId: string): Promise<IResponse<UserDocument>> {
    const user = await this.isUser(userId);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    await this.userModel.updateOne({
      _id: userId,
      emailVerificationCode: verificationCode,
    });

    const { error } = await this.resend.emails.send({
      from: 'Atmintis <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Verify your email',
      html: `<div style="background-color: black; color: white; padding: 10px"><div>Hello, ${user.username}</div><div style="font-size: 28px">Your verification code: <span style="font-weight: 500">${verificationCode}</span></div></div>`,
    });

    if (error) throw new InternalServerErrorException(error);

    return {
      success: true,
      message: 'Check your inbox for 6-digit code!',
      response: user,
    };
  }

  async finalizeEmailVerification(
    userId: string,
    verificationCode: string,
  ): Promise<IResponse<boolean>> {
    const user = await this.isUser(userId);

    if (user.emailVerificationCode !== verificationCode)
      throw new BadRequestException('Verification code is invalid!');

    await this.userModel.updateOne(
      { _id: userId },
      { emailVerificationCode: null, isEmailVerified: true },
    );

    return {
      success: true,
      message: 'Email has been successfully verified',
      response: true,
    };
  }

  async updateUserData(id: string, data: UpdateUserDto): Promise<IResponse<UserDocument>> {
    const isIdCorrect = mongoose.isValidObjectId(id);
    if (!isIdCorrect) throw new BadRequestException('User id is not valid');

    const user = await this.isUser(id);

    if (data?.newEmail) {
      user.email = data.newEmail;
      const res = await user.save();

      return {
        success: true,
        message: `Your email is changed to ${data.newEmail}`,
        response: res,
      };
    }

    if (data?.newUsername) {
      user.username = data.newUsername;
      const res = await user.save();

      return {
        success: true,
        message: `Your username is changed to ${data.newUsername}`,
        response: res,
      };
    }
  }

  async updateUserPassword(
    userId: string,
    data: UpdateUserPasswordDto,
  ): Promise<IResponse<UserDocument>> {
    const user = await this.isUser(userId);

    const isOldPasswordCorrect = await this.checkUserPassword(data.oldPassword, user.password);
    if (!isOldPasswordCorrect) throw new BadRequestException('Wrong password');

    user.password = await bcrypt.hash(data.newPassword, 7);
    const res = await user.save();

    return {
      success: true,
      message: `Your password has been changed`,
      response: res,
    };
  }

  async updateUserPicture(id: string, fileBuffer: Buffer): Promise<IResponse<UpdateWriteOpResult>> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('No user found');

    const filename = 'img-pp-' + uuidv4() + '.webp';

    if (user.profilePicture) await del(user.profilePicture);

    const blob = await put('images/' + filename, fileBuffer, { access: 'public' });

    const res = await this.userModel.updateOne(
      { _id: id },
      { profilePicture: blob.url },
      { new: true },
    );

    return {
      success: true,
      message: 'Profile picture has been updated',
      response: res,
    };
  }

  async updateUserLocale(id: string, locale: Locale): Promise<IResponse<UpdateWriteOpResult>> {
    const user = await this.userModel.updateOne({ _id: id }, { locale }, { runValidators: true });

    return {
      success: true,
      message: 'Locale has been updated',
      response: user,
    };
  }

  async deleteUser(id: string, requestingUser: IJwtPayload): Promise<IResponse<DeleteResult>> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('No user found');

    let res;

    if (requestingUser.role === 'admin') {
      res = await this.userModel.deleteOne({ _id: id });
      if (user.profilePicture) await del(user.profilePicture);

      await this.listsService.deleteAllListsByUserId(id);
      await this.entriesService.deleteAllEntriesByUserId(id);
      await this.definitionsService.deleteAllDefinitionsByUserId(id);
      await this.exerciseService.deleteAllExercisesByUser(id);
    } else {
      if (requestingUser.sub !== String(user._id))
        throw new ForbiddenException('You do not have permission to delete users');

      res = await this.userModel.deleteOne({ _id: id });
      if (user.profilePicture) await del(user.profilePicture);

      await this.listsService.deleteAllListsByUserId(id);
      await this.entriesService.deleteAllEntriesByUserId(id);
      await this.definitionsService.deleteAllDefinitionsByUserId(id);
      await this.exerciseService.deleteAllExercisesByUser(id);
    }

    return {
      success: true,
      message: `Your account and all data have been deleted`,
      response: res,
    };
  }

  async enableMfa(id: string): Promise<IMfaPayload> {
    const user = await this.isUser(id);
    if (user.mfa.isEnabled) throw new BadRequestException('2FA is already enabled');

    const secret = authenticator.generateSecret(32);

    await this.userModel.updateOne(
      { _id: id },
      { mfa: { isEnabled: false, secret: '', tempSecret: secret } },
    );

    const otpUri = authenticator.keyuri(user.email, 'atmintis', secret);
    const qr = await qrcode.toDataURL(otpUri);

    return {
      secret,
      qrcode: qr,
    };
  }

  async finalizeMfa(id: string, token: string): Promise<IResponse<UpdateWriteOpResult> | IError> {
    const user = await this.isUser(id);
    if (!user.mfa.tempSecret) throw new BadRequestException('No temporary secret found');
    const secret = user.mfa.tempSecret;

    const isValid = await this.verifyMfa(id, token, secret);

    if (!isValid) throw new BadRequestException('Invalid token, try again');

    const res = await this.userModel.updateOne(
      { _id: id },
      { mfa: { isEnabled: true, secret: secret, tempSecret: '' } },
    );

    return {
      success: true,
      message: `2FA has been enabled`,
      response: res,
    };
  }

  async disableMfa(id: string, token: string): Promise<IResponse<UpdateWriteOpResult | boolean>> {
    const user = await this.isUser(id);
    if (!user.mfa.isEnabled) throw new BadRequestException('2FA is not enabled yet');

    const isValid = await this.verifyMfa(id, token);

    if (!isValid)
      return {
        success: false,
        message: 'Incorrect token, try again',
        response: isValid,
      };

    const res = await this.userModel.updateOne(
      { _id: id },
      { mfa: { isEnabled: false, secret: '', tempSecret: '' } },
    );

    return {
      success: true,
      message: `2FA has been disabled`,
      response: res,
    };
  }

  async verifyMfa(id: string, token: string, secret?: string) {
    const user = await this.getUserById(id);

    if (secret) return authenticator.verify({ token, secret });
    return authenticator.verify({ token, secret: user.mfa.secret });
  }

  async updateUsersToken(id: string, refreshToken: string) {
    return this.userModel.findByIdAndUpdate(id, { refreshToken }, { new: true });
  }

  async checkUserPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  private async isUser(id: string): Promise<UserDocument> {
    validateId(id);

    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('No user found');

    return user;
  }
}
