export interface PartialUser {
  email: string;
  username: string;
  nickname: string | null;
  avatar: string | null; // TODO: avatar image from stored images
  createdAt: Date | null;
  flags: number;
}

export interface User extends PartialUser {
  id: number;
  password: string;
}

export enum UserFlags {
  NONE = 0,
  OPERATOR = 1 << 0,
}

export interface Session {
  token: string;
}
