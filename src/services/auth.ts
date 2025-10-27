import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: true,
});

export const signInWithGoogle =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};
