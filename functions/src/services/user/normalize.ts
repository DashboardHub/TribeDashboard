import { User } from '../../models/user.model';
import * as request from 'request-promise-native';

const formatGithubResponse = (userCred: request.FullResponse, document: User): User | null => {
  const user = JSON.parse(userCred.body);
  if (document.github) {
    const credentials = {
      accessToken: document.github.credentials.accessToken,
      provider: document.github.credentials.provider,
      refreshToken: document.github.credentials.refreshToken
    };

    const profile = {
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      followers: user.followers,
      following: user.following,
      avatarUrl: user.avatar_url
    };

    const additionalUserInfo = {
      username: document.github.additionalUserInfo.username,
      profile
    };

    const normalisedUser = {
      ...document,
      github: {
        displayName: document.github.displayName,
        photoUrl: document.github.photoUrl,
        creationAt: document.github.creationAt,
        lastSignInAt: document.github.lastSignInAt,
        additionalUserInfo,
        credentials,
      },
      uid: document.uid,
    };
    return normalisedUser;
  }
  return null;
}

const formatTwitterResponse = (userCred: request.FullResponse, document: User): User | null => {
  const user = JSON.parse(userCred.body);
  if (document.twitter) {
    const credentials = {
      accessToken: document.twitter.credentials.accessToken,
      provider: document.twitter.credentials.provider,
      refreshToken: document.twitter.credentials.refreshToken ? document.twitter.credentials.refreshToken : '',
    };

    const profile = {
      createdAt: user.created_at,
      updatedAt: user.updated_at ? user.updated_at : '',
      followers: user.followers_count,
      following: user.friends_count,
      avatarUrl: user.profile_image_url
    };

    const additionalUserInfo = {
      username: document.twitter.additionalUserInfo.username,
      profile
    };

    const normalisedUser = {
      ...document,
      twitter: {
        displayName: document.twitter.displayName,
        photoUrl: document.twitter.photoUrl,
        creationAt: document.twitter.creationAt,
        lastSignInAt: document.twitter.lastSignInAt,
        additionalUserInfo,
        credentials,
      },
      uid: document.uid,
    };
    return normalisedUser;
  }
  return null;
}

export const normalizeSocialResponse = {
  formatGithubResponse,
  formatTwitterResponse
}
