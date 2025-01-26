import { IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  isDefault: boolean;

  description?: string;
  image?: string;

  @IsNotEmpty()
  userId: string;
}

export class UpdateListDto {
  title?: string;
  description?: string;
  isPrivate?: boolean;
}
