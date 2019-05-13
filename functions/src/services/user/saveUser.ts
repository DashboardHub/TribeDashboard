import * as admin from 'firebase-admin';
import { UserSocial } from '../../models/userSocial.model';
import { User } from '../../models/user.model';
import { getAccountStats } from './getAccountStats';


const saveUserSocialRecord = async (social: UserSocial) => {
  try {
    await admin.firestore().doc(`userSocial/${social.userId}`).set(social);
  }
  catch (err) {
    console.log('Error in savingUserSocailRecord', err);
  }
}

const saveUserRecord = async (record: User) => {
  try {
    await admin.firestore().doc(`user/${record.uid}`).set(record)
  }
  catch (err) {
    console.log('Error in savingUserRecord', err);
    throw err;
  }
}

const normalizeUserSocial = (user: User, social: UserSocial, provider: string): UserSocial | null => {
  switch (provider) {
    case 'github':
      return getAccountStats.githubStats(user, social);
    case 'twitter':
      return getAccountStats.twitterStats(user, social);
    default:
      return null;
  }
}

const getUserSocialDoc = async (userId: String): Promise<UserSocial> => {
  try {
    let socialRecord: UserSocial;
    const document = await admin.firestore().doc(`userSocial/${userId}`).get();
    socialRecord = (document.data() as UserSocial);
    return socialRecord;
  }
  catch (err) {
    console.log('Error in getting user social document', userId);
    throw err;
  }
}

const setUserProvider = async (user: User, provider: string) => {
  try {
    const social: UserSocial = await getUserSocialDoc(user.uid)
    const socialRecord: UserSocial | null = normalizeUserSocial(user, social, provider);
    if (socialRecord && Object.keys(socialRecord).length) {
      await saveUserSocialRecord(socialRecord);
    }
  }
  catch (err) {
    console.log('Error in savingUserRecord', err);
    throw err;
  }
}

export const saveUser = {
  setUserProvider,
  saveUserRecord
}
