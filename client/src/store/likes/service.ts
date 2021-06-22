import { Like } from '../../models/like.model';
import { firebaseAuth } from '../../utils/firebase';

/**
 * Like the post with given ID.
 * @param id Post ID
 */
export const likePost = async (id: string): Promise<Like> => {
  // Send the post request to like the post.
  const response = await fetch('/v1/api/like-api/like', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify({ postId: id }),
  });

  // Check for any errors and send the error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Return like object
  return await response.json();
};

/**
 * Unlike the post with given ID.
 * @param id Post ID
 */
export const unlikePost = async (id: string): Promise<void> => {
  // Send the post request to unlike the post.
  const response = await fetch('/v1/api/like-api/unlike', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify({ postId: id }),
  });

  // Check for any errors and send the error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};
