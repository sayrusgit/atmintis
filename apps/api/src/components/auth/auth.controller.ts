import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '@components/auth/auth.service';
import { SignupDataDto, UserDataDto } from '@components/auth/dtos/auth.dto';
import { Response } from 'express';
import { Public } from '@decorators/public.decorator';
import { RefreshTokenGuard } from '@guards/rt.guard';
import { User } from '@decorators/user.decorator';
import { Cookies } from '@decorators/cookie.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from '../../common/pipes/sharp.pipe';
import { IMAGE_INTERCEPTOR_OPTIONS } from '@constants/multer-config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private FIFTEEN_MINUTES = 15 * 60 * 1000;
  private TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  private SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  private isSecureCookie = process.env.BUILD === 'build';

  @Public()
  @UseInterceptors(FileInterceptor('file', IMAGE_INTERCEPTOR_OPTIONS))
  @Post('signup')
  async signup(
    @Body() data: SignupDataDto,
    @UploadedFile(new SharpPipe()) filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(data, filename);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      maxAge: this.TWENTY_FOUR_HOURS,
      secure: this.isSecureCookie,
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: this.SEVEN_DAYS,
      secure: this.isSecureCookie,
    });

    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: UserDataDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(data);

    response.cookie('accessToken', result.response.tokens.accessToken, {
      httpOnly: true,
      maxAge: this.TWENTY_FOUR_HOURS,
      secure: this.isSecureCookie,
    });
    response.cookie('refreshToken', result.response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.SEVEN_DAYS,
      secure: this.isSecureCookie,
    });

    return result;
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@User('sub') userId: string, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.logout(userId);
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return result;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @User('sub') userId: string,
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refreshTokens(userId, refreshToken);
    response.cookie('accessToken', result.response.tokens.accessToken, {
      httpOnly: true,
      maxAge: this.TWENTY_FOUR_HOURS,
      secure: this.isSecureCookie,
    });
    response.cookie('refreshToken', result.response.tokens.refreshToken, {
      httpOnly: true,
      maxAge: this.SEVEN_DAYS,
      secure: this.isSecureCookie,
    });

    return result;
  }
}
