import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAqU_ru39jWoSBVDmMtKM42aDIO6dC2814",
  authDomain: "signin-b93b6.firebaseapp.com",
  databaseURL: "https://signin-b93b6.firebaseio.com",
  projectId: "signin-b93b6",
  storageBucket: "signin-b93b6.appspot.com",
  messagingSenderId: "320714521562"
};
firebase.initializeApp(config);
export default firebase;