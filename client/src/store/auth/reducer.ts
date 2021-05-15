import { AuthState, AuthAction } from './types.d';
import * as actionTypes from './actionTypes';
import { User } from '../../models/user.model';

const intialState: AuthState = {
  loggedInUser: new User('', '', '', ''),
};

const authReducer = (state: AuthState = intialState, action: AuthAction) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default authReducer;
