export const ROUTES = {
  ENTRIES: 'entries',
  LISTS: 'lists',
  SPACES: 'spaces',
  USERS: 'users',
  AUTH: 'auth',
  DEFINITIONS: 'definitions',
  EXERCISES: 'exercises',
};

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM_USER = 'premium_user',
}

export interface IJwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
}

export enum Locale {
  EN = 'en',
  LT = 'lt',
  CZ = 'cz',
  PL = 'pl',
  DE = 'de',
}
