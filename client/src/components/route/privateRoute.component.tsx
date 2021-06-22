import React, { useEffect, useState } from 'react';
import { Redirect, RouteProps, Route } from 'react-router-dom';
import { firebaseAuth } from '../../utils/firebase';
import Loading from '../lottie/Loading.animation';
import * as AuthService from './../../store/auth/service';
import * as AuthActions from './../../store/auth/actionCreators';
import { useDispatch } from 'react-redux';

export type PrivateRouteProps = RouteProps & {
  redirectTo: string;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(
    () =>
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          setAuthenticated(true);
          dispatch(AuthActions.autoLogin(await AuthService.getLoggedInUser()));
        } else {
          setAuthenticated(false);
          dispatch(AuthActions.logout());
        }

        setLoading(false);
      }),
    [dispatch]
  );

  return loading ? (
    <Loading message='Welcome To YASM!!🌟' />
  ) : authenticated ? (
    <Route {...props} />
  ) : (
    <Redirect to={props.redirectTo} />
  );
};

export default PrivateRoute;
