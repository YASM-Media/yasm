import { Box } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../../pages/Auth/Login.page';
import Register from '../../pages/Auth/Register.page';
import _404 from '../../pages/Error/_404.page';
import Landing from '../../pages/Landing/Landing.page';
import PostForm from '../../pages/Post/PostForm.page';
import Posts from '../../pages/Post/Posts.page';
import CompleteUserProfile from '../../pages/Profile/CompleteUserProfile.page';
import Search from '../../pages/Search/Search.page';
import Splash from '../../pages/Splash.page';
import UpdateAccount from '../../pages/UpdateAccount/UpdateAccount.page';
import PrivateRoute from './privateRoute.component';

export interface RoutesProps {}

const Routes: React.FunctionComponent<RoutesProps> = () => {
  return (
    <Box bgColor='white' minH='100vh'>
      <Router>
        <Switch>
          <Route exact path='/' component={Splash} />
          <Route exact path='/landing' component={Landing} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
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

          <PrivateRoute
            redirectTo='/login'
            exact
            path='/posts'
            component={Posts}
          />

          <PrivateRoute
            redirectTo='/login'
            exact
            path='/posts/create'
            component={PostForm}
          />

          <PrivateRoute
            redirectTo='/login'
            exact
            path='/posts/update/:id'
            render={(props) => (
              <PostForm isEdit={true} postId={props.match.params.id} />
            )}
          />
          <PrivateRoute
            redirectTo='/login'
            exact
            path='/search'
            component={Search}
          />
          <Route path='*' component={_404} />
        </Switch>
      </Router>
    </Box>
  );
};

export default Routes;
