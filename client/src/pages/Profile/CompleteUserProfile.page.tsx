import { Flex } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import UserProfile from '../../components/profile/UserProfile.component';
import { User } from '../../models/user.model';

export interface CompleteUserProfileProps {
  ownProfile?: boolean;
  uid?: string;
}

const CompleteUserProfile: React.FunctionComponent<CompleteUserProfileProps> =
  ({ ownProfile = true, uid }) => {
    const [user, setUser] = useState<User>(new User('', '', '', '', '', ''));
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const auth = useSelector((state: RootStateOrAny) => state.auth);

    useEffect(() => {
      const followersTemp: User[] = [];
      const followingTemp: User[] = [];

      const apiRoute = ownProfile
        ? '/v1/api/follow-api/get'
        : `/v1/api/follow-api/get/${uid}`;

      fetch(apiRoute, { credentials: 'include' })
        .then((response) => response.json())
        .then((data) => {
          const mainUser = new User(
            data.id,
            data.firstName,
            data.lastName,
            data.biography,
            data.imageUrl,
            data.emailAddress
          );

          setUser(mainUser);

          data.followers.forEach((follower: any) => {
            const followerUser = new User(
              follower.id,
              follower.firstName,
              follower.lastName,
              follower.biography,
              follower.imageUrl,
              follower.emailAddress
            );

            followersTemp.push(followerUser);
          });

          data.following.forEach((following: any) => {
            const followingUser = new User(
              following.id,
              following.firstName,
              following.lastName,
              following.biography,
              following.imageUrl,
              following.emailAddress
            );

            followingTemp.push(followingUser);
          });
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));

      setFollowers(followersTemp);
      setFollowing(followingTemp);
    }, [ownProfile, uid]);

    return loading ? (
      <h1>Loading</h1>
    ) : (
      <React.Fragment>
        <Flex h='100vh' align='center' direction='column' p={30}>
          <UserProfile
            user={user}
            followers={followers}
            following={following}
            ownProfile={auth.loggedInUser.uid === user.uid}
          />
        </Flex>
      </React.Fragment>
    );
  };

export default CompleteUserProfile;
