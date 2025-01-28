import { Length } from 'class-validator';

export class UserDataDto {
  readonly login: string;
  readonly password: string;
  readonly mfaCode?: string;
}

export class SignupDataDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
