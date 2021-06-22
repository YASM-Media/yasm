import { User } from '../../models/user.model';
import { firebaseAuth } from '../../utils/firebase';

export const searchForUsers = async (searchQuery: string): Promise<User[]> => {
  const encodedSearchQuery = encodeURIComponent(searchQuery);

  const response = await fetch(
    `/v1/api/search/user?searchQuery=${encodedSearchQuery}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
      },
    }
  );

  // Check for errors and send error message to client.
  if (!response.ok) {
    const responseJson = await response.json();
    const message = responseJson.message;

    throw new Error(message);
  }

  const results: User[] = await response.json();

  return results;
};
