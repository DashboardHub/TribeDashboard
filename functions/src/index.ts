import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { accountType } from './services/user/getAccountType';
import { User } from './models/user.model';
// import serviceAccount from './dashboard-dev.json'; // TODO: Replace the service account json file here
import { fetchUser } from './services/user/fetchUser';
import { UserSocial } from './models/userSocial.model';
import Constant from './constant';

admin.initializeApp({
  // credential: admin.credential.cert((serviceAccount) as admin.ServiceAccount),
  databaseURL: "https://tribedashboard-dev.firebaseio.com"
}
);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const cron = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().collection('user').get();
    if (snapshot.docs.length) {
      snapshot.docs.forEach((doc) => {
        const user: User = ({ ...doc.data() }) as User;
        accountType.updateUser(user);
      });
      response.send('CRON is running succcessfully');
    }
    else {
      response.send('Empty docs');
    }
  }
  catch (err) {
    console.error(err);
    response.send(err);
  }
})

export const getStats = functions.https.onRequest(async (request, response) => {
  if (!request.headers || request.headers['authorization'] !== Constant.authorizationPassword) {
    response.send("User not authorized to hit the API");
    return;
  }
  try {
    const snapshot = await admin.firestore().collection('userSocial').get();
    const userSocial = snapshot.docs.map((doc) => {
      return doc.data() as UserSocial;
    });

    const userTribeCount = userSocial.map(doc => {
      return fetchUser.calculateFollowersCount(doc);
    });

    const topTribeUsers = userTribeCount.sort((a, b) => {
      if (a.totalFollowers < b.totalFollowers) {
        return 1;
      }
      if (a.totalFollowers > b.totalFollowers) {
        return -1;
      }
      return 0;
    })
    response.send(topTribeUsers);
  }
  catch (err) {
    console.error(err);
    response.send(err);
  }
})

