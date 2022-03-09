import { AuthState, AuthAction } from './types.d';
import * as actionTypes from './actionTypes';
import { User } from '../../models/user.model';

const intialState: AuthState = {
  loggedInUser: User.newEmptyUser(),
  isLoggedIn: false,
};

const authReducer = (
  state: AuthState = intialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case actionTypes.LOGIN: {
      return {
        ...state,
        loggedInUser: action.user,
        isLoggedIn: true,
      };
    }

    case actionTypes.LOGOUT: {
      return {
        ...state,
        loggedInUser: User.newEmptyUser(),
        isLoggedIn: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default authReducer;
