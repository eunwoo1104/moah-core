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

export interface UserTable {
  id: number;
  email: string;
  password: string;
  username: string;
  nickname: string | null;
  avatar: string | null;
  created_at: Date | null;
  flags: number;
}

export enum UserFlags {
  NONE = 0,
  OPERATOR = 1 << 0,
}

export interface Session {
  token: string;
}

export interface SessionTable {
  refresh_token: string;
  user: number;
  device_identifier: string;
  created_at: Date | null;
}
