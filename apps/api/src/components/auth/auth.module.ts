import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {AccessTokenStrategy} from "@components/auth/strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "@components/auth/strategies/refreshToken.strategy";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "@components/users/users.module";

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
