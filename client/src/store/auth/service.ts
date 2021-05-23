import { UpdateProfileType } from './../../types/updateProfile.type';
import { User } from '../../models/user.model';
import { firebaseStorage } from '../../utils/firebase';

const profilePictureStorage = firebaseStorage.child('/profile-pictures');

export const register = async (user: User): Promise<void> => {
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

export const uploadProfileImage = async (
  file: File | Blob | ArrayBuffer | Uint8Array,
  email: string
) => {
  await profilePictureStorage.child(`${email}.jpg`).put(file);

  return await profilePictureStorage.child(`${email}.jpg`).getDownloadURL();
};
