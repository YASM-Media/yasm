import { CreateCommentType } from './../../types/comments/createComment.type';
import { DeleteCommentType } from '../../types/comments/deleteComment.type';
import { Post } from '../../models/post.model';

/**
 * Delete the comment with given ID.
 * @param id Post ID
 */
export const deletePost = async (
  deleteCommentType: DeleteCommentType
): Promise<void> => {
  // Send the post request to delete the comment.
  const response = await fetch('/v1/api/comments/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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
