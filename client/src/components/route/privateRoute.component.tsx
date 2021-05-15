import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Redirect, RouteProps, Route } from 'react-router-dom';
import { User } from '../../models/user.model';
import { AuthState } from '../../store/auth/types';
import * as AuthActions from './../../store/auth/actionCreators';

export type PrivateRouteProps = RouteProps & {
  redirectTo: string;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isLoggedIn)
      fetch('/v1/api/user/me', {
        method: 'GET',
        credentials: 'include',
      })
        .then((response: Response) => {
          if (response.ok) {
            setAuthenticated(true);
            return response.json();
          } else {
            setAuthenticated(false);
            dispatch(AuthActions.logout());
          }
          setLoading(false);
        })
        .then((json) => {
          if (json) {
            const user = new User(
              json.firstName,
              json.lastName,
              json.emailAddress,
              json.password
            );

            dispatch(AuthActions.autoLogin(user));
          }
        })
        .finally(() => setLoading(false))
        .catch((error: Error) => console.log(error));
    else {
      setAuthenticated(true);
      setLoading(false);
    }
  }, [auth.isLoggedIn, dispatch]);

  return loading ? (
    <h1>Loading</h1>
  ) : authenticated ? (
    <Route {...props} />
  ) : (
    <Redirect to={props.redirectTo} />
  );
};

export default PrivateRoute;
