import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@components/users/users.service';
import { SignupDataDto, UserDataDto } from '@components/auth/dtos/auth.dto';
import { hashData } from '@helpers/HashData';
import { UserDocument } from '@entities/user.schema';
import * as bcrypt from 'bcrypt';
import { IResponse, ITokens } from '@shared/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(data: SignupDataDto, profilePicture: string): Promise<ITokens> {
    const user = await this.usersService.createUser(data, profilePicture);
    const tokens = await this.generateTokens(
      String(user._id),
      user.username,
      user.email,
      user.role,
    );

    await this.updateRefreshToken(String(user._id), tokens.refreshToken);

    return tokens;
  }

  async login(data: UserDataDto): Promise<IResponse<any>> {
    const user = await this.validateUserData(data);
    const tokens = await this.generateTokens(
      String(user._id),
      user.username,
      user.email,
      user.role,
    );

    await this.updateRefreshToken(String(user._id), tokens.refreshToken);

    if (user.mfa.isEnabled) {
      return {
        success: true,
        message: 'Successfully logged in',
        response: {
          tokens,
          user,
        },
      };
    }

    return {
      success: true,
      message: 'Successfully logged in',
      response: {
        tokens,
        user,
      },
    };
  }

  async logout(userId: string): Promise<IResponse<UserDocument>> {
    const user = await this.usersService.updateUsersToken(userId, null);

    if (!user)
      return {
        success: false,
        message: 'Something went wrong...',
        response: user,
      };

    return {
      success: true,
      message: 'Successfully logged out',
      response: user,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<IResponse<any>> {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateTokens(
      String(user._id),
      user.username,
      user.email,
      user.role,
    );

    await this.updateRefreshToken(String(user._id), tokens.refreshToken);

    return {
      success: true,
      message: 'Successfully refreshed authentication tokens',
      response: {
        tokens,
        user,
      },
    };
  }

  async generateTokens(
    userId: string,
    username: string,
    email: string,
    role: string,
  ): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, email, role },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '24h' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, email, role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await hashData(refreshToken);

    await this.usersService.updateUsersToken(userId, hashedRefreshToken);
  }

  private async validateUserData(data: UserDataDto): Promise<UserDocument> {
    const user = await this.usersService.getUserByNameOrEmail(data.username, data.email);
    if (!user) throw new BadRequestException('Incorrect email or password');

    const isPasswordValid = await this.usersService.checkUserPassword(data.password, user.password);

    if (!(user && isPasswordValid))
      throw new UnauthorizedException({
        message: 'Incorrect credentials',
      });

    return user;
  }
}
