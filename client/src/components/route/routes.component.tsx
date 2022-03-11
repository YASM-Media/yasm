import { Box } from '@chakra-ui/react';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Loading from '../lottie/Loading.animation';
import PrivateRoute from './privateRoute.component';

const Login = lazy(() => import('../../pages/Auth/Login.page'));
const Register = lazy(() => import('../../pages/Auth/Register.page'));
const _404 = lazy(() => import('../../pages/Error/_404.page'));
const Landing = lazy(() => import('../../pages/Landing/Landing.page'));
const PostForm = lazy(() => import('../../pages/Post/PostForm.page'));
const Posts = lazy(() => import('../../pages/Post/Posts.page'));
const CompleteUserProfile = lazy(
  () => import('../../pages/Profile/CompleteUserProfile.page')
);
const Search = lazy(() => import('../../pages/Search/Search.page'));
const Splash = lazy(() => import('../../pages/Splash.page'));
const UpdateAccount = lazy(
  () => import('../../pages/UpdateAccount/UpdateAccount.page')
);
const Threads = lazy(() => import('../../pages/Chat/Threads.page'));
const Chat = lazy(() => import('../../pages/Chat/Chat.page'));
const Activities = lazy(() => import('../../pages/Activity/Activities.page'));
const Post = lazy(() => import('../../pages/Post/Post.page'));

export interface RoutesProps {}

const Routes: React.FunctionComponent<RoutesProps> = () => {
  return (
    <Box bgColor='white' minH='100vh'>
      <Router>
        <Suspense fallback={<Loading message='Welcome To YASM!!🌟' />}>
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
            <PrivateRoute
              redirectTo='/login'
              exact
              path='/threads'
              component={Threads}
            />
            <PrivateRoute
              redirectTo='/login'
              exact
              path='/threads/:id'
              render={(props) => (
                <Chat threadId={props.match.params.id as string} />
              )}
            />
            <PrivateRoute
              redirectTo='/login'
              exact
              path='/activities'
              component={Activities}
            />
            <PrivateRoute
              redirectTo='/login'
              exact
              path='/post/:id'
              render={(props) => <Post id={props.match.params.id as string} />}
            />
            <Route path='*' component={_404} />
          </Switch>
        </Suspense>
      </Router>
    </Box>
  );
};

export default Routes;
