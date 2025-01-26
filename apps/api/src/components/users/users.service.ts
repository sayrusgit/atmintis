import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { IError, IResponse } from '@shared/types';
import { DefinitionsService } from '@components/data/services/definitions.service';
import { EntriesService } from '@components/data/services/entries.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private listsService: ListsService,
    private definitionsService: DefinitionsService,
    private entriesService: EntriesService,
  ) {}

  async getUsers(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async getUserByName(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async getUserByNameOrEmail(username: string, email: string): Promise<UserDocument> {
    return this.userModel.findOne({
      $or: [{ email }, { username }],
    });
  }

  async getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async createUser(data: CreateUserDto, profilePicture: string): Promise<UserDocument> {
    const isUsernameUsed = await this.getUserByName(data.username);

    if (isUsernameUsed) throw new BadRequestException('Sorry, but this username is used');

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

  async updateUserPicture(id: string, filename: string): Promise<IResponse<UpdateWriteOpResult>> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      await removeFile(filename, 'images');
      throw new NotFoundException('No user found');
    }

    if (user.profilePicture) {
      const isRemoved = await removeFile(user.profilePicture, 'images');

      if (!isRemoved) {
        await removeFile(filename, 'images');

        const res = await this.userModel.updateOne({ _id: id }, { profilePicture: '' });

        return {
          success: false,
          message: 'Something went wrong, profile picture was not updated',
          response: res,
        };
      }
    }

    const res = await this.userModel.updateOne(
      { _id: id },
      { profilePicture: filename },
      { new: true },
    );

    return {
      success: true,
      message: 'Profile picture has been updated',
      response: res,
    };
  }

  async deleteUser(id: string): Promise<IResponse<DeleteResult>> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException('No user found');

    const res = await this.userModel.deleteOne({ _id: id });
    if (user.profilePicture) await removeFile(user.profilePicture, 'images');

    await this.listsService.deleteAllListsByUserId(id);
    await this.entriesService.deleteAllEntriesByUserId(id);
    await this.definitionsService.deleteAllDefinitionsByUserId(id);

    return {
      success: true,
      message: `Your account and all data have been deleted`,
      response: res,
    };
  }

  async enableMfa(id: string): Promise<{ secret: string; qrcode: string }> {
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
