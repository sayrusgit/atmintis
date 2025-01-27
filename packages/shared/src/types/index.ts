/* Global Types */

export interface IResponse<T> {
  success: boolean;
  message: string;
  response: T;
}

export interface IBareResponse {
  success: boolean;
  message: string;
}

export interface IError {
  error: boolean;
  message: string;
  statusCode?: number;
}

/* Auth Types */

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM_USER = 'premium_user',
}

export interface IUser {
  mfa: {
    isEnabled: boolean;
    secret: string;
    tempSecret: string;
  },
  _id: string;

  username: string;
  email: string;
  password: string;
  role: Role;
  profilePicture: string;

  spaces: [],
  refreshToken: string;

  createdAt: string;
  updatedAt: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
}

export interface IMfaPayload {
  secret: string;
  qrcode: string
}

export interface ISession {
  id: string;
  username: string;
  email: string;
}

export interface ILoginData extends IBareResponse {
  response: {
    tokens: ITokens;
    user: IUser;
  };
}

/* Data Types */

export interface IList {
  _id: string;

  title: string;
  description: string;
  image: string;
  entryNumber: number;

  isDefault: boolean;
  isPrivate: boolean;

  user: string;

  createdAt: string;
  updatedAt: string;
}

export interface IEntryContext {
  value: string;
  color: string;
}

export interface IEntry {
  _id: string;

  value: string;
  description: string;
  type?: string;
  tags?: string[];
  context?: IEntryContext[];
  definitions?: IDefinition[];
  idioms: string[];

  list: string;
  user: string;
  image: string;

  createdAt: string;
  updatedAt: string;
}

export interface IDefinition {
  _id: string;

  description: string;
  examples?: string[];
  prefixes?: string[];

  synonyms?: IDefinitionReferences[];
  opposites?: IDefinitionReferences[];
  compares?: IDefinitionReferences[];

  parentEntry?: string;
}

export interface IDefinitionReferences {
  value: string;
  id: string;
  _id?: string;
}

export interface IPracticeSession {
  _id: string;

  user: string;
  list?: string;

  entries: IPracticeEntry[];
  totalEntries: number;
  ongoingEntry: IPracticeEntry;
  ongoingEntryIndex: number;

  hintsUsed: number;
  imagesRevealed: number;
  correctAnswersCount: number;

  isFinished: boolean;
  isSkipped: boolean;
  finishedAt: Date;
  sessionTime: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IPracticeEntry {
  value: string;
  description: string,
  image: string,
  id: string;
  _id: string;
}