import React, { useEffect, useState } from 'react';
import { Redirect, RouteProps, Route } from 'react-router-dom';
import { firebaseAuth } from '../../utils/firebase';
import Loading from '../lottie/Loading.animation';

export type PrivateRouteProps = RouteProps & {
  redirectTo: string;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(
    () =>
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }

        setLoading(false);
      }),
    []
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
