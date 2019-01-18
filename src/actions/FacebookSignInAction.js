import Expo from 'expo';
import firebase from '../api/Firebase';

export const SIGN_IN_FACEBOOK = 'SIGN_IN_FACEBOOK';
const appID = '2196250970662645';
export function loginWithFacebook() {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await Expo.Facebook.logInWithReadPermissionsAsync(appID, {
          permissions: ['public_profile'],
          behavior: 'web',
        });
        console.log('facebook signin result', result);
        if (result.type === 'success') {
          let credential = firebase.auth.FacebookAuthProvider.credential(result.token);
          const auth = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
          

          if (auth.user) {
            dispatch({ type: SIGN_IN_FACEBOOK, data: { user: auth.user } });
           const { picture, name, birthday} = await loadUserInfoFromFacebook(result.token);
          const updatedProfileResult =  await  auth.user.updateProfile({photoURL:picture,displayName:name})
            console.log('user updated profile');
        } else {
            alert('Error while login');
            dispatch({ type: SIGN_IN_FACEBOOK, error: 'Error while login' }); 
        }
        } else {
          dispatch({ type: SIGN_IN_FACEBOOK, error: 'cancelled' });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: SIGN_IN_FACEBOOK, error: error.message });
      }
    }, 0);
  };
}


async function loadUserInfoFromFacebook(token){
  const response = await fetch(
    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,birthday,picture.type(large)`
  );
  return  await response.json();
}