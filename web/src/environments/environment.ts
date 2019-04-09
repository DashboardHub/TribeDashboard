// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 'x.x.x',
  firebase:{
   apiKey: 'AIzaSyA_YnmL2hlmjNi1J6i47PJwR6yOwsuSrdk',
   authDomain: 'tribedashboard-dev.firebaseapp.com',
   databaseURL: 'https://tribedashboard-dev.firebaseio.com',
   projectId: 'tribedashboard-dev',
   storageBucket: 'tribedashboard-dev.appspot.com',
   messagingSenderId: '180845259287'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
