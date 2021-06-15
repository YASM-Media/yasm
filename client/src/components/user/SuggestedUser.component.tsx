import { Avatar, Button, Flex, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { User } from '../../models/user.model';
import { AuthState } from '../../store/auth/types';
import * as FollowService from './../../store/follow/service';

export interface SuggestedUserProps {
  user: User;
}

const SuggestedUser: React.FunctionComponent<SuggestedUserProps> = ({
  user,
}) => {
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);
  const [following, setFollowing] = useState(
    user.followers.find((u) => u.id === auth.loggedInUser.id) ? true : false
  );

  const followOrUnfollowUser = async (): Promise<void> => {
    if (following) {
      await FollowService.unfollowUser(user.id);
      setFollowing(false);
    } else {
      await FollowService.followUser(user.id);
      setFollowing(true);
    }
  };

  return (
    <Flex
      direction='row'
      justify='space-between'
      align='center'
      boxShadow='0 4px 8px 0 rgba(0,0,0,0.5)'
      borderRadius='lg'
      marginRight={5}
      marginY={5}
      p={5}
    >
      <Link href={`/account/profile/${user.id}`}>
        <Flex direction='row'>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            src={user.imageUrl}
            marginX={5}
          />
          <Flex direction='column'>
            <Text>{`${user.firstName} ${user.lastName}`}</Text>
            <Text>{user.biography}</Text>
          </Flex>
        </Flex>
      </Link>
      <Button variant='ghost' onClick={followOrUnfollowUser}>
        {following ? 'Unfollow' : 'Follow'}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
