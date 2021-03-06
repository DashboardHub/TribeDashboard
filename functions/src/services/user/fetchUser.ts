import * as request from 'request-promise-native';
import * as functions from 'firebase-functions';
import { normalizeSocialResponse } from './normalize';
import { saveUser } from './saveUser';
import constant from '../../constant';
import { User } from '../../models/user.model';


const saveRecord = async (record: User, provider: string) => {
  try {
    await saveUser.setUserProvider(record, provider);
    await saveUser.saveUserRecord(record);
  }
  catch (err) {
    console.log('Error record does not exists', err);
    throw new Error('Record does not exists');
  }
}

const fetchGithubRecord = (userName: string, document: User, provider: string) => {
  const uri = constant.githubUrl + userName;
  const options = {
    headers: {
      'User-Agent': '', // @TODO Give a specific userName, good to configure in firebase env.
      'Authorization': `${document.github ? document.github.credentials.accessToken : ''}`
    },
    uri: uri
  }
  try {
    request.get(options).then((githubResponse) => {
      if (githubResponse) {
        const record = normalizeSocialResponse.formatGithubResponse(githubResponse, document);
        record ? saveRecord(record, provider) : null;
      }
    })
      .catch((err) => {
        console.log('Error in reqesting github record', err);
      })
  }
  catch (err) {
    console.log('Error in fetchingGithubUser', err, userName);
    throw err;
  }
}

const fetchTwitterRecord = (userName: string, document: User, provider: string) => {
  const endPoint = constant.twitterUrl + userName
  const options = {
    headers: { 'Authorization': `Bearer ${functions.config().twitter.token}` }, // Fetch Token using firebase environment
    uri: endPoint
  }
  try {
    request.get(options).then((twitterResponse) => {
      if (twitterResponse) {
        const record = normalizeSocialResponse.formatTwitterResponse(twitterResponse, document);
        record ? saveRecord(record, provider) : null;
      }
    })
      .catch((err) => {
        console.error('Error in fetchTwitter Record', err);
      })
  }
  catch (err) {
    console.error('Error in fetchingGithubUser', err, userName);
    throw err;
  }
}

export const fetchUser = {
  fetchGithubRecord,
  fetchTwitterRecord
}
