import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../../pages/Auth/Login.page';
import Register from '../../pages/Auth/Register.page';
import Dummy from '../../pages/Dummy.page';
import Private from '../../pages/Private.page';
import Splash from '../../pages/Splash.page';
import PrivateRoute from './privateRoute.component';

export interface RoutesProps {}

const Routes: React.FunctionComponent<RoutesProps> = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route exact path='/dummy' component={Dummy} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute
          redirectTo='/login'
          exact
          path='/private'
          component={Private}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
