import { AuthAction } from './types.d';
import * as actionTypes from './actionTypes';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { LoginUser } from '../../types/loginUser.type';
import { User } from '../../models/user.model';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../utils/firebase';

export const login = (
  user: LoginUser
): ThunkAction<Promise<void>, {}, {}, AuthAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
    const response = await fetch('/v1/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const responseJson = await response.json();
      const message = responseJson.message;

      throw new Error(message);
    }

    const userJson = await response.json();

    const action: AuthAction = {
      type: actionTypes.LOGIN,
      user: new User(
        userJson.id,
        userJson.firstName,
        userJson.lastName,
        userJson.biography,
        userJson.imageUrl,
        [],
        []
      ),
    };

    dispatch(action);
  };
};

export const autoLogin = (user: User): AuthAction => ({
  type: actionTypes.LOGIN,
  user,
});

export const logout = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
    await signOut(firebaseAuth);

    return dispatch({
      type: actionTypes.LOGOUT,
      user: User.newEmptyUser(),
    });
  };
};

export const deleteAccount = (password: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
    const response = await fetch('/v1/api/auth/delete', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await firebaseAuth.currentUser?.getIdToken()}`,
      },
    });

    // Check for any errors and send error message to the client.
    if (!response.ok) {
      const responseJson = await response.json();
      const message = responseJson.message;

      throw new Error(message);
    }

    await signOut(firebaseAuth);

    return dispatch({
      type: actionTypes.LOGOUT,
      user: User.newEmptyUser(),
    });
  };
};
