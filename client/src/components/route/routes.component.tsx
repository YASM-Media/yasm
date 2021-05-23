import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../../pages/Auth/Login.page';
import Register from '../../pages/Auth/Register.page';
import Dummy from '../../pages/Dummy.page';
import Private from '../../pages/Private.page';
import CompleteUserProfile from '../../pages/Profile/CompleteUserProfile.page';
import Splash from '../../pages/Splash.page';
import UpdateAccount from '../../pages/UpdateAccount/UpdateAccount.page';
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
        <PrivateRoute
          redirectTo='/login'
          exact
          path='/account/update'
          component={UpdateAccount}
        />
        <PrivateRoute
          redirectTo='/login'
          exact
          path='/account/profile/me'
          component={CompleteUserProfile}
        />

        <PrivateRoute
          redirectTo='/login'
          exact
          path='/account/profile/:id'
          render={(props) => (
            <CompleteUserProfile
              ownProfile={false}
              uid={props.match.params.id}
            />
          )}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
