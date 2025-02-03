import { IsNotEmpty } from 'class-validator';
import { IDefinitionReferences } from '@shared/types';

export class CreateDefinitionDto {
  description?: string;
  examples?: string[];
  prefixes?: string[];

  synonyms?: IDefinitionReferences[];
  opposites?: IDefinitionReferences[];
  compares?: IDefinitionReferences[];

  parentEntry: string;
  user: string;
}
