import { IsNotEmpty } from 'class-validator';
import { Definition, DefinitionDocument } from '@entities/definition.schema';
import { List } from '@entities/list.schema';
import { IEntryContext } from '@shared/types';

export class CreateEntryDto {
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  description: string;

  type?: string;
  tags?: string[];
  context?: IEntryContext;
  definitions?: DefinitionDocument[];
  idioms?: string[];
  list: string | undefined;

  @IsNotEmpty()
  userId: string;
}

export class UpdateEntryDto {
  value: string;
  description: string;
  type?: string;
  tags?: string[];
  context?: IEntryContext[];
  definitions?: Definition[];
  idioms?: string[];
  creationDate?: number;
  list?: List;
  collections?: string[];
}
