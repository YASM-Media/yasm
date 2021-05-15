import { User } from '../../models/user.model';

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
