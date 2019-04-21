import { Social } from './social.model';

export interface UserSocial {
  github?: {
    updatedAt: string,
    followers: number,
    following: number,
    userId: string,
  };
  twitter?: {
    updatedAt: string,
    followers: number,
    following: number,
    userId: string,
  };
  youtube?: {
    updatedAt: string,
    followers: number,
    following: number,
    userId: string,
  };
  instagram?: {
    updatedAt: string,
    followers: number,
    following: number,
    userId: string,
  };
}
