import { Post } from '../../models/post.model';

/**
 * Fetch Posts By New
 * @returns New Posts Array
 */
export const fetchNewPosts: () => Promise<Post[]> = async () => {
  // Send a request to the server for fetching new posts.
  const response = await fetch('/v1/api/posts/get/new', {
    method: 'GET',
    credentials: 'include',
  });

  // Check for errors and send error message to client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Return JSON Data.
  const postData: Post[] = await response.json();
  return postData;
};

/**
 * Fetch best posts for the user.
 * @returns Best Posts Array
 */
export const fetchBestPosts: () => Promise<Post[]> = async () => {
  // Send a request to the server to fetch the best posts.
  const response = await fetch('/v1/api/posts/get/best', {
    method: 'GET',
    credentials: 'include',
  });

  // Check for errors and return error to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Return best posts array.
  const postData: Post[] = await response.json();
  return postData;
};

/**
 * Fetch posts by user.
 * @param userId User ID to fetch posts for
 * @returns User posts array
 */
export const fetchPostsByUser: (userId: string) => Promise<Post[]> = async (
  userId: string
) => {
  // Send a request to the server and fetch the posts by user.
  const response = await fetch(`/v1/api/posts/get/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });

  // Check for errors and send the client the error messsage.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  // Return user posts array.
  const postData: Post[] = await response.json();
  return postData;
};

/**
 * Fetch post details by Id.
 * @param postId Post ID
 * @returns Post Details
 */
export const fetchPostById: (postId: string) => Promise<Post> = async (
  postId: string
) => {
  const response = await fetch(`/v1/api/posts/get/post/${postId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  const postData: Post = await response.json();
  return postData;
};
