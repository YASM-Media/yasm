import { Flex } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Loading from '../../components/lottie/Loading.animation';
import Navbar from '../../components/nav/Navbar.component';
import UserPosts from '../../components/profile/UserPosts.component';
import UserProfile from '../../components/profile/UserProfile.component';
import FAB from '../../components/utility/FAB.component';
import { User } from '../../models/user.model';
import { AuthState } from '../../store/auth/types';

export interface CompleteUserProfileProps {
  ownProfile?: boolean;
  uid?: string;
}

/**
 * Display Complete Profile for the user.
 * @param ownProfile To display logged in user or not.
 * @param uid User ID to display.
 */
const CompleteUserProfile: React.FunctionComponent<CompleteUserProfileProps> =
  ({ ownProfile = true, uid }) => {
    // User Profile and followers, following state.
    const [user, setUser] = useState<User>(
      new User('', '', '', '', '', '', [], [])
    );
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);

    // Loading State.
    const [loading, setLoading] = useState(true);

    // Redux state.
    const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

    // History Hook.
    const history = useHistory();

    // Fetch the user details along with
    // their follow and following details.
    useEffect(() => {
      // Temporary arrays.
      const followersTemp: User[] = [];
      const followingTemp: User[] = [];

      // Decide on which endpoint to use.
      const apiRoute = ownProfile
        ? '/v1/api/follow-api/get'
        : `/v1/api/follow-api/get/${uid}`;

      // Fetch the required data.
      fetch(apiRoute, { credentials: 'include' })
        .then((response) => response.json())
        .then((data) => {
          // Save followers to temporary arrays.
          data.followers.forEach((follower: any) => {
            delete follower.password;
            followersTemp.push(follower);
          });

          // Save following to temporary arrays.
          data.following.forEach((following: any) => {
            delete following.password;
            followingTemp.push(following);
          });

          delete data.password;
          delete data.followers;
          delete data.following;

          // Save user data to state.
          setUser(data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));

      // Save followers and following in state.
      setFollowers(followersTemp);
      setFollowing(followingTemp);
    }, [ownProfile, uid]);

    return loading ? (
      <Loading message='Loading The User Profile For You!!🌟' />
    ) : (
      <React.Fragment>
        <Navbar />
        <Flex align='center' direction='column' p={30}>
          <UserProfile
            user={user}
            followers={followers}
            following={following}
            ownProfile={auth.loggedInUser.id === user.id}
          />
          <UserPosts user={user} />
          <FAB onClick={() => history.push('/posts/create')} />
        </Flex>
      </React.Fragment>
    );
  };

export default CompleteUserProfile;
