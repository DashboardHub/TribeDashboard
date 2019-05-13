import { User } from '../../models/user.model';
import { UserSocial } from '../../models/userSocial.model';

const githubStats = (user: User, social: UserSocial): UserSocial | null => {
  if (user.github) {
    return {
      ...social,
      github: {
        following: user.github.additionalUserInfo.profile.following,
        followers: user.github.additionalUserInfo.profile.followers,
        updatedAt: (user.github.additionalUserInfo.profile.updatedAt ? user.github.additionalUserInfo.profile.updatedAt : new Date().toISOString())
      },
      userId: user.uid
    }
  }
  return null;
}

const twitterStats = (user: User, social: UserSocial): UserSocial | null => {
  if (user.twitter) {
    return {
      ...social,
      twitter: {
        following: user.twitter.additionalUserInfo.profile.following,
        followers: user.twitter.additionalUserInfo.profile.followers,
        updatedAt: (user.twitter.additionalUserInfo.profile.updatedAt ? user.twitter.additionalUserInfo.profile.updatedAt : new Date().toISOString())
      },
      userId: user.uid
    }
  }
  return null;
}

export const getAccountStats = {
  githubStats,
  twitterStats,
}
