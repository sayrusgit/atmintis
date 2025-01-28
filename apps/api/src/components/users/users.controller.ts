import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Locale, Role, ROUTES } from '@constants/index';
import { UsersService } from '@components/users/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from '@components/users/dtos/users.dto';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { User } from '@decorators/user.decorator';
import { IMAGE_INTERCEPTOR_OPTIONS } from '@constants/multer-config';
import { SharpPipe } from '../../common/pipes/sharp.pipe';
import { Roles } from '@decorators/roles.decorator';

@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('me')
  getMySession(@User('sub') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data, null);
  }

  @Put(':id')
  updateUserData(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUserData(id, data);
  }

  @UseInterceptors(NoFilesInterceptor())
  @Put('change-password/:id')
  updateUserPassword(@Param('id') id: string, @Body() data: UpdateUserPasswordDto) {
    return this.usersService.updateUserPassword(id, data);
  }

  @Put('update-picture/:id')
  @UseInterceptors(FileInterceptor('file', IMAGE_INTERCEPTOR_OPTIONS))
  updateUserPicture(@Param('id') id: string, @UploadedFile(new SharpPipe()) filename: string) {
    return this.usersService.updateUserPicture(id, filename);
  }

  @Put('update-locale/:id')
  updateUserLocale(@Param('id') id: string, @Query('locale') locale: Locale) {
    return this.usersService.updateUserLocale(id, locale);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('enable-mfa/:id')
  enableMfa(@Param('id') id: string) {
    return this.usersService.enableMfa(id);
  }

  @Post('finalize-mfa/:id')
  finalizeMfa(@Param('id') id: string, @Body('token') token: string) {
    return this.usersService.finalizeMfa(id, token);
  }

  @Post('disable-mfa/:id')
  disableMfa(@Param('id') id: string, @Body('token') token: string) {
    return this.usersService.disableMfa(id, token);
  }
}
