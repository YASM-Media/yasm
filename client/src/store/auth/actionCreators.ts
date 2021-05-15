import { AuthAction } from './types.d';
import * as actionTypes from './actionTypes';

export const login = (email: string, password: string) => {
  console.log('LOGIN');
};

export const logout = (email: string, password: string) => {
  console.log('LOGOUT');
};
