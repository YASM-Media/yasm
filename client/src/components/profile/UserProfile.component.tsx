import {
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { User } from '../../models/user.model';
import CustomModal from '../modal/modal.component';
import UserList from './UserList.component';
import * as FollowService from './../../store/follow/service';

export interface UserProfileProps {
  user: User;
  followers: User[];
  following: User[];
  ownProfile: boolean;
}

const UserProfile: React.FunctionComponent<UserProfileProps> = ({
  user,
  followers,
  following,
  ownProfile,
}) => {
  const auth = useSelector((state: RootStateOrAny) => state.auth);
  const [displayMode, setDisplayMode] = useState('follower');
  const [isFollowing, setIsFollowing] = useState(
    followers.find((user) => user.uid === auth.loggedInUser.uid) ? true : false
  );
  const [followersState, setFollowersState] = useState(followers);

  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showFollowers = () => {
    setDisplayMode('follower');
    onOpen();
  };

  const showFollowing = () => {
    setDisplayMode('following');
    onOpen();
  };

  const followOrUnfollowUser = async () => {
    try {
      if (isFollowing) {
        await FollowService.unfollowUser(user.uid);
        setFollowersState(
          followers.filter((follower) => follower.uid !== auth.loggedInUser.uid)
        );
      } else {
        await FollowService.followUser(user.uid);
        setFollowersState([...followersState, auth.loggedInUser]);
      }

      toast({
        title: 'Success',
        description: `Successfully ${
          isFollowing ? 'unfollowed' : 'followed'
        } the user!!🌟`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <React.Fragment>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify={{ base: 'center', lg: 'space-evenly' }}
        align='center'
        w={{ base: '100%', lg: '60%' }}
        border='1px'
        borderColor='grey'
        borderRadius='2xl'
        py={5}
      >
        <Image src={user.imageUrl} borderRadius='full' boxSize='150px' />

        <Flex direction='column' align='center' justify='center' minW='210px'>
          <Flex
            direction='column'
            align={{ base: 'center', lg: 'flex-start' }}
            my={3}
          >
            <Text fontSize='3xl'>
              {user.firstName} {user.lastName}
            </Text>
            <Text>{user.biography}</Text>
          </Flex>

          <Flex
            my={3}
            direction='row'
            justify='space-between'
            align='center'
            w='100%'
          >
            <Flex
              cursor='pointer'
              flexDirection='row'
              w='40%'
              justify='space-between'
              onClick={showFollowers}
            >
              <Text>{followersState.length}</Text>
              <Text fontWeight='bold'>followers</Text>
            </Flex>

            <Flex
              cursor='pointer'
              flexDirection='row'
              w='40%'
              justify='space-between'
              onClick={showFollowing}
            >
              <Text>{following.length}</Text>
              <Text fontWeight='bold'>following</Text>
            </Flex>
          </Flex>

          {!ownProfile && (
            <Button onClick={followOrUnfollowUser} colorScheme='teal'>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
          {ownProfile && (
            <Button
              colorScheme='teal'
              onClick={() => history.push('/account/update')}
            >
              Edit your profile
            </Button>
          )}
        </Flex>
      </Flex>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <UserList
          userList={displayMode === 'follower' ? followersState : following}
          emptyMessage={
            displayMode === 'follower'
              ? 'The user does not have any followers!!🌟'
              : 'The user does not follow any one!!🌟'
          }
        />
      </CustomModal>
    </React.Fragment>
  );
};

export default UserProfile;
