import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import Loading from '../components/lottie/Loading.animation';
import { User } from '../models/user.model';
import { firebaseAuth } from '../utils/firebase';
import * as AuthActions from './../store/auth/actionCreators';

export interface SplashProps {}

const Splash: React.FunctionComponent<SplashProps> = () => {
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
    <Redirect to='/posts' />
  ) : (
    <Redirect to='/landing' />
  );
};

export default Splash;
