import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import Loading from '../components/lottie/Loading.animation';
import { User } from '../models/user.model';
import * as AuthActions from './../store/auth/actionCreators';

export interface SplashProps {}

const Splash: React.FunctionComponent<SplashProps> = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
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
      })
      .then((json) => {
        if (json) {
          const user = new User(
            json.id,
            json.firstName,
            json.lastName,
            json.biography,
            json.imageUrl,
            json.emailAddress,
            [],
            []
          );

          dispatch(AuthActions.autoLogin(user));
          setLoading(false);
        }
      })
      .finally(() => setLoading(false))
      .catch((error: Error) => console.log(error));
  }, [dispatch]);

  return loading ? (
    <Loading message='Welcome To YASM!!🌟' />
  ) : authenticated ? (
    <Redirect to='/posts' />
  ) : (
    <Redirect to='/landing' />
  );
};

export default Splash;
