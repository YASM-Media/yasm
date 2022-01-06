import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import Loading from '../components/lottie/Loading.animation';
import * as AuthService from './../store/auth/service';
import * as AuthActions from './../store/auth/actionCreators';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase';

export interface SplashProps {}

const Splash: React.FunctionComponent<SplashProps> = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, async (user) => {
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
    <Redirect to='/posts' />
  ) : (
    <Redirect to='/landing' />
  );
};

export default Splash;
