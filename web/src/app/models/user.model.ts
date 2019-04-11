export interface User {
  displayName: string,
  photoUrl: string,
  uid: string,
  createdAt: string,
  lastLoginAt: string,
  stsTokenManager: {
    accessToken: string,
    refreshToken: string
    expirationTime: string,
  },
  credentials: {
    accessToken: string,
    providerID: string,
  },
  additionalUserInfo: {
    profile: {
      createdAt: string,
      updatedAt: string,
      followers: 0,
      following: 0,
      avatarURL: string
    },
    userName: string
  }
}
