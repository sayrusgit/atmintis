export class UserDataDto {
  readonly username?: string;
  readonly email?: string;
  readonly password: string;
}

export class SignupDataDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
