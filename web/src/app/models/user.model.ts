export interface User {
  displayName: string;
  photoUrl: string;
  uid: string;
  creationAt: string;
  lastSignInAt: string;
  credentials: {
    accessToken: string,
    providerId: string,
    refreshToken: string,
    secret?: string,  // Optional field
  };
  additionalUserInfo: {
    profile: {
      createdAt: string,
      updatedAt: string,
      followers: 0,
      following: 0,
      avatarUrl: string
    },
    username: string
  };
}
