import { IsNotEmpty } from 'class-validator';
import type { Definition, DefinitionDocument } from '@entities/definition.schema';
import { List } from '@entities/list.schema';
import type { IExtra } from '@shared/types';

export class CreateEntryDto {
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  description: string;

  type?: string;
  tags?: string[];
  extras?: IExtra[];
  definitions?: DefinitionDocument[];
  idioms?: string[];
  list: string | undefined;

  @IsNotEmpty()
  userId: string;
}

export class UpdateEntryDto {
  value?: string;
  description?: string;
  type?: string;
  tags?: string[];
  extras?: IExtra[];
  definitions?: Definition[];
  idioms?: string[];
  confidenceScore?: number;
  lastExercise?: Date;
  creationDate?: number;
  list?: List;
  collections?: string[];
}
