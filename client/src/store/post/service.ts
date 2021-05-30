import { UpdatePostType } from './../../types/posts/updatePost.type';
import { CreatePostType } from './../../types/posts/createPost.type';
import { Post } from '../../models/post.model';
import { firebaseStorage } from '../../utils/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../../models/image.model';

const postsPictureStorage = firebaseStorage.child('/posts');

/**
 * Fetch Posts By New
 * @returns New Posts Array
 */
export const fetchNewPosts = async (): Promise<Post[]> => {
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
export const fetchBestPosts = async (): Promise<Post[]> => {
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
export const fetchPostsByUser = async (userId?: string): Promise<Post[]> => {
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
export const fetchPostById = async (postId?: string): Promise<Post> => {
  if (postId) {
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
  } else {
    throw new Error('Please Give a valid ID');
  }
};

/**
 * Convert Blob URL to blob file.
 * @param blobString Blob URL String
 * @returns Blob/File Object
 */
const convertToBlob = async (blobString: string): Promise<Blob> => {
  const response = await fetch(blobString);

  return await response.blob();
};

/**
 * Upload Images to Firebase and retrieve URLs
 * @param file Image File
 * @returns Firebase Storage URL for the file
 */
const uploadPostImage = async (
  file: File | Blob | ArrayBuffer | Uint8Array
): Promise<string> => {
  // Generate UUID for the image.
  const uuid = uuidv4();

  // Upload the image to Firebase.
  await postsPictureStorage.child(`${uuid}.jpg`).put(file);

  // Generate URL and return the same.
  return await postsPictureStorage.child(`${uuid}.jpg`).getDownloadURL();
};

/**
 * Send a POST request to the server and save the new post.
 * @param post Create Post Details
 */
export const createPost = async (post: CreatePostType): Promise<void> => {
  // Upload all the image files to Firebase and generate a URL for the same.
  const firebaseImages = await Promise.all(
    post.images.map(
      async (imageFile: Image) =>
        await uploadPostImage(await convertToBlob(imageFile.imageUrl))
    )
  );

  // Send the post request with new post body.
  const response = await fetch('/v1/api/posts/create', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: firebaseImages,
      text: post.text,
    }),
  });

  // Check for any errors and send error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};

/**
 * Send a POST request to the server and save the updated post.
 * @param post Update Post Details
 */
export const updatePost = async (post: UpdatePostType): Promise<void> => {
  // Upload all the image files to Firebase and generate a URL for the same.
  const firebaseImages = await Promise.all(
    post.images.map(async (imageFile: Image) => {
      if (imageFile.imageUrl.startsWith('blob')) {
        return await uploadPostImage(await convertToBlob(imageFile.imageUrl));
      } else if (imageFile.imageUrl.startsWith('http')) {
        return imageFile.imageUrl;
      }
    })
  );

  // Send the post request with updated post body.
  const response = await fetch('/v1/api/posts/update', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: post.id,
      images: firebaseImages,
      text: post.text,
    }),
  });

  // Check for any errors and send error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};

/**
 * Delete the post with given ID.
 * @param id Post ID
 */
export const deletePost = async (id: string): Promise<void> => {
  // Send the post request to delete the post.
  const response = await fetch('/v1/api/posts/delete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  // Check for any errors and send the error message to the client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }
};
