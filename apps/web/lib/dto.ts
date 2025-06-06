import type { IDefinitionReferences } from '@shared/types';

export interface CreateEntryDto {
  value: string;
  description: string;
  type: string;
  list?: string;
}

export interface UpdateEntryDto {
  value?: string;
  description?: string;
  type?: string;
  list?: string;
}

export interface CreateEntryContextDto {
  value: string;
  color: string;
}

export interface ExerciseDto {
  isPositive: boolean;
  isHintUsed?: boolean;
  isImageRevealed?: boolean;
  nextEntryIndex: number;
}

export interface CreateDefinitionDto {
  description: string;
  examples?: string[];
  prefixes?: string[];

  synonyms?: IDefinitionReferences[];
  opposites?: IDefinitionReferences[];
  compares?: IDefinitionReferences[];

  parentEntry: string;
}

export interface ChangeUserPasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
