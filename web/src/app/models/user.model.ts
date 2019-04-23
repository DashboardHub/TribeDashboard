import { SocialConnections } from './socialConnections';

export interface User {
  displayName: string;
  photoUrl: string;
  uid: string;
  creationAt: string;
  lastSignInAt: string;
  isPrimary: boolean;
  credentials: {
    accessToken: string,
    provider: string,
    refreshToken?: string,
    secret?: string,  // Optional field
  };
  socialConnections?: SocialConnections;
  additionalUserInfo: {
    profile: {
      createdAt: string,
      updatedAt?: string,
      followers: number,
      following: number,
      avatarUrl: string
    },
    username: string
  };
}
