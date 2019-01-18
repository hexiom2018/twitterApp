import authenticationService from "../api/AuthenticationService";
import Expo from "expo";
export const SIGNUP_GOOGLE_ACCOUNT = "SIGNUP_GOOGLE_ACCOUNT";
import firebase from "../api/Firebase";
export function loginWithGoogle() {
  return dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await Expo.Google.logInAsync({
          behavior: "web",
          androidClientId:
            "223372639224-gd9fk1qq044qvt8790k742cta8sgr1qq.apps.googleusercontent.com",
          iosClientId:
            "223372639224-s2qibpht817plkrd8tcv3kkhil4ksk2v.apps.googleusercontent.com",
          androidStandaloneAppClientId:
            "223372639224-7sh1eagh0mhsb3lhv27s74l5o2emue54.apps.googleusercontent.com",
          iosStandaloneAppClientId:
            "223372639224-uq5accrlp53objd3710jdmfnoj0qilk4.apps.googleusercontent.com",
          scopes: ["profile", "email"]
        });
        console.log("google signin result",result);  
        if (result.type === "success") {
          let credential = firebase.auth.GoogleAuthProvider.credential(
            result.idToken,
            result.accessToken
          );
          const val = await firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential);
          if (val.user) {
            dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, data: { user: val.user } });
            const updatedProfile = await val.user.updateProfile({photoURL:result.user.photoURL,displayName:result.user.name})
          } else if (val.uid) {
            dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, data: { user: val } });
          } else {
            alert(val);
          }
        } else {
          dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, error: "cancelled" });
        }
      } catch (error) {
        dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, error: error.message });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}
