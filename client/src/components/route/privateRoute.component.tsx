import React, { useEffect, useState } from 'react';
import { Redirect, RouteProps, Route } from 'react-router-dom';

export type PrivateRouteProps = RouteProps & {
  redirectTo: string;
};

const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/v1/api/user/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response: Response) => {
        setAuthenticated(response.ok);
        setLoading(false);
      })
      .catch((error: Error) => console.log(error));
  }, []);

  return loading ? (
    <h1>Loading</h1>
  ) : authenticated ? (
    <Route {...props} />
  ) : (
    <Redirect to={props.redirectTo} />
  );
};

export default PrivateRoute;
