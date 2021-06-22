import { CreateCommentType } from './../../types/comments/createComment.type';
import { DeleteCommentType } from '../../types/comments/deleteComment.type';
import { Post } from '../../models/post.model';
import { UpdateCommentType } from '../../types/comments/updateComment.type';
import { firebaseAuth } from '../../utils/firebase';

/**
 * Send a POST request to the server and save the new comment.
 * @param post Create Post Details
 */
export const createComment = async (
  createCommentType: CreateCommentType
): Promise<Post> => {
  // Send the post request with new comment body.
  const response = await fetch('/v1/api/comments/create', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(createCommentType),
  });

  // Check for any errors and send error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  return await response.json();
};

/**
 * Send a POST request to the server and save the updated comment.
 * @param post Update Post Details
 */
export const updateComment = async (
  updateCommentType: UpdateCommentType
): Promise<Post> => {
  // Send the post request with updated comment body.
  const response = await fetch('/v1/api/comments/update', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(updateCommentType),
  });

  // Check for any errors and send error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  return await response.json();
};

/**
 * Delete the comment with given ID.
 * @param id Post ID
 */
export const deleteComment = async (
  deleteCommentType: DeleteCommentType
): Promise<void> => {
  // Send the post request to delete the comment.
  const response = await fetch('/v1/api/comments/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
    },
    body: JSON.stringify(deleteCommentType),
  });

  // Check for any errors and send the error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};
