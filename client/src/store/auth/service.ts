import { LoginUser } from './../../types/loginUser.type';
import { UserType } from './../../types/user.type';
import { UpdatePasswordType } from './../../types/updatePassword.type';
import { UpdateProfileType } from './../../types/updateProfile.type';
import {
  emailAuthProvider,
  firebaseAuth,
  firebaseStorage,
} from '../../utils/firebase';
import { UpdateEmailType } from '../../types/updateEmail.type';
import { User } from '../../models/user.model';

const profilePictureStorage = firebaseStorage.child('/profile-pictures');

export const register = async (user: UserType): Promise<void> => {
  const response = await fetch('/v1/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};

export const getLoggedInUser = async (): Promise<User> => {
  const response = await fetch('/v1/api/user/me', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  const user: User = await response.json();
  return user;
};

export const login = async (user: LoginUser) => {
  try {
    await firebaseAuth.signInWithEmailAndPassword(
      user.emailAddress,
      user.password
    );
  } catch (error) {
    // If user does not exist.
    if (error.code === 'auth/user-not-found') {
      throw new Error('This email is not registered to any account.');
    }

    // If user provided a wrong password.
    if (error.code === 'auth/wrong-password') {
      throw new Error('You have typed a wrong password, please try again.');
    }
  }
};

/**
 * Fetch suggested users for the user.
 * @returns Suggested Users Array
 */
export const fetchSuggestedPosts = async (): Promise<User[]> => {
  // Send a request to the server to fetch the suggested users.
  const response = await fetch('/v1/api/user/suggested', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
  });

  // Check for errors and return error to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Return suggested users array.
  const suggestedUsers: User[] = await response.json();
  return suggestedUsers;
};

export const updateUserProfile = async (
  user: UpdateProfileType
): Promise<void> => {
  const response = await fetch('/v1/api/user/update/profile', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};

export const updateEmailAddress = async (
  data: UpdateEmailType
): Promise<void> => {
  const response = await fetch('/v1/api/user/update/email', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  try {
    const currentUserEmail = firebaseAuth.currentUser?.email;
    if (currentUserEmail) {
      const userCredentials = emailAuthProvider.credential(
        currentUserEmail,
        data.password
      );

      await firebaseAuth.currentUser?.reauthenticateWithCredential(
        userCredentials
      );
      await firebaseAuth.currentUser?.updateEmail(data.emailAddress);
    }
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      throw new Error('Email provided is in an invalid format');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email provided is already in use.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password given');
    }
  }
};

export const updatePassword = async (
  data: UpdatePasswordType
): Promise<void> => {
  const response = await fetch('/v1/api/user/update/password', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  try {
    const currentUserEmail = firebaseAuth.currentUser?.email;
    if (currentUserEmail) {
      const userCredentials = emailAuthProvider.credential(
        currentUserEmail,
        data.oldPassword
      );

      await firebaseAuth.currentUser?.reauthenticateWithCredential(
        userCredentials
      );
      await firebaseAuth.currentUser?.updatePassword(data.newPassword);
    }
  } catch (error) {
    if (error.code === 'auth/weak-password') {
      throw new Error('Password provided is weak.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password given');
    }
  }
};

export const uploadProfileImage = async (
  file: File | Blob | ArrayBuffer | Uint8Array,
  uid: string
) => {
  await profilePictureStorage.child(`${uid}.jpg`).put(file);

  return await profilePictureStorage.child(`${uid}.jpg`).getDownloadURL();
};
