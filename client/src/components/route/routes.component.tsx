import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dummy from '../../pages/Dummy.page';
import Private from '../../pages/Private.page';
import PrivateRoute from './privateRoute.component';

export interface RoutesProps {}

const Routes: React.FunctionComponent<RoutesProps> = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/dummy' component={Dummy} />
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
