import { firebaseAuth } from '../../utils/firebase';

export const followUser = async (uid: string): Promise<void> => {
  const response = await fetch(`/v1/api/follow-api/follow/${uid}`, {
    method: 'POST',
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
};

export const unfollowUser = async (uid: string): Promise<void> => {
  const response = await fetch(`/v1/api/follow-api/unfollow/${uid}`, {
    method: 'POST',
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
};
