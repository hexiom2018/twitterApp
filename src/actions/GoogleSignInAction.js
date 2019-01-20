import authenticationService from "../api/AuthenticationService";
import Expo from "expo";
export const SIGNUP_GOOGLE_ACCOUNT = "SIGNUP_GOOGLE_ACCOUNT";
import firebase from "../api/Firebase";
export function loginWithGoogle() {
  return dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId:
            '187936954064-1d43h6fn26a55cmj08gjn2homvlm4pv8.apps.googleusercontent.com',
          iosClientId:
            '187936954064-4aftsohm5fu6kb3cgk9dsnkll9nicklj.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
        console.log("google signin result", result);
        if (result.type === "success") {
          console.log('result===', result);

          const { idToken, accessToken } = result;
          const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(success => {
              // user res, create your user, do whatever you want
              const val = success
              if (val.user) {
                console.log('success==>', val);
                dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, data: { user: val.user } });
                // const updatedProfile = await val.user.updateProfile({ photoURL: result.user.photoURL, displayName: result.user.name })
              } else if (val.uid) {
                dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, data: { user: val } });
              } else {
                alert(val);
              }
            })
            .catch(error => {
              console.log("firebase cred err:", error.message);
            });
          return result.accessToken;

        } else {
          console.log('/////');
          return { cancelled: true };
        }
      } catch (error) {
        dispatch({ type: SIGNUP_GOOGLE_ACCOUNT, error: error.message });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}
