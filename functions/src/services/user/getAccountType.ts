import { fetchUser } from './fetchUser';
import { User } from '../../models/user.model';

const selectSocialAccount = async (provider: string, document: User) => {
  try {
    let userName;
    switch (provider) {
      case 'github':
        userName = document.github ? document.github.additionalUserInfo.username : ''
        await fetchUser.fetchGithubRecord(userName, document, provider);
        break;
      case 'twitter':
         userName = document.twitter ? document.twitter.additionalUserInfo.username : ''
         await fetchUser.fetchTwitterRecord(userName,document,provider);
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
      await selectSocialAccount(provider, document)
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
