import { fetchUser } from './fetchUser';
import { User } from '../../models/user.model';

const selectSocialAccount = (provider: string, document: User) => {
  try {
    let userName;
    switch (provider) {
      case 'github':
        userName = document.github ? document.github.additionalUserInfo.username : ''
        fetchUser.fetchGithubRecord(userName, document, provider);
        break;
      case 'twitter':
        userName = document.twitter ? document.twitter.additionalUserInfo.username : ''
        fetchUser.fetchTwitterRecord(userName, document, provider);
        break;
      default:
        break;
    }
  }
  catch (err) {
    console.log('Error in selectSocialAccount', err);
    throw err;
  }
}

const updateUser = (document: User) => {
  try {
    const providers = Object.keys(document);
    providers.forEach(async (provider) => {
      selectSocialAccount(provider, document)
    })
  }
  catch (err) {
    console.log('Error in fetchUserOnProvider', err);
    throw err;
  }
}

export const accountType = {
  updateUser,
  selectSocialAccount
}
