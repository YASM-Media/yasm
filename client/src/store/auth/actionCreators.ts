import { AuthAction } from './types.d';
import * as actionTypes from './actionTypes';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { LoginUser } from '../../types/loginUser.type';
import { User } from '../../models/user.model';

export const login = (
  user: LoginUser
): ThunkAction<Promise<void>, {}, {}, AuthAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AuthAction>) => {
    const response = await fetch('/v1/api/auth/login', {
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

    const userJson = await response.json();

    const action: AuthAction = {
      type: actionTypes.LOGIN,
      user: new User(
        userJson.id,
        userJson.firstName,
        userJson.lastName,
        userJson.biography,
        userJson.imageUrl,
        userJson.emailAddress,
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

export const logout = () => ({
  type: actionTypes.LOGOUT,
  user: new User('', '', '', '', '', '', [], []),
});
