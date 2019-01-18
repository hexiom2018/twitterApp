import firebase from "./Firebase";

export async function emailRegistration(registration) {
  console.log("AuthService", registration);

  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(
        registration.email,
        registration.password
      );
    await result.user.sendEmailVerification();
    await firebase.auth().currentUser.updateProfile({
      firstName: registration.firstName,
      lastName: registration.lastName,
      displayName:`${registration.firstName} ${registration.lastName}`
    });

    return result.user;
  } catch (error) {
    return error;
  } finally {
  }
}
