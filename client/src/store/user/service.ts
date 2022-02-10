import { User } from '../../models/user.model';
import { firebaseAuth } from '../../utils/firebase';

export const getUserDetails = async (uid: string): Promise<User> => {
  const response = await fetch(`/v1/api/follow-api/get/${uid}`, {
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
