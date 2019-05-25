import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { accountType } from './services/user/getAccountType';
import { User } from './models/user.model';
// import serviceAccount from './dashboard-dev.json'; // TODO: Replace the service account json file here

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
