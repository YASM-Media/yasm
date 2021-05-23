import { UserType } from './../../types/user.type';
import { UpdatePasswordType } from './../../types/updatePassword.type';
import { UpdateProfileType } from './../../types/updateProfile.type';
import { firebaseStorage } from '../../utils/firebase';
import { UpdateEmailType } from '../../types/updateEmail.type';

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

export const updateUserProfile = async (
  user: UpdateProfileType
): Promise<void> => {
  const response = await fetch('/v1/api/user/update/profile', {
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

export const updateEmailAddress = async (
  data: UpdateEmailType
): Promise<void> => {
  const response = await fetch('/v1/api/user/update/email', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
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
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};

export const uploadProfileImage = async (
  file: File | Blob | ArrayBuffer | Uint8Array,
  uid: string
) => {
  await profilePictureStorage.child(`${uid}.jpg`).put(file);

  return await profilePictureStorage.child(`${uid}.jpg`).getDownloadURL();
};
