export interface Account {
  displayName: string;
  photoUrl: string;
  creationAt: string;
  lastSignInAt: string;
  credentials: {
    accessToken: string;
    provider: string;
    refreshToken?: string;
    secret?: string;  // Optional field
  };
  additionalUserInfo: {
    profile: {
      createdAt: string;
      updatedAt?: string;
      followers: number;
      following: number;
      avatarUrl: string;
    },
    username: string;
  };
}
