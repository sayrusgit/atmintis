import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto {
  newUsername?: string;

  newEmail?: string;
}

export class UpdateUserPasswordDto {
  oldPassword: string;
  newPassword: string;
}
