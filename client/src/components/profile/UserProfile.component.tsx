import {
  Avatar,
  Button,
  Flex,
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
import * as ChatService from './../../store/chat/service';
import { AuthState } from '../../store/auth/types';
import { CreateThreadDto } from '../../dto/chat/create-thread.dto';

export interface UserProfileProps {
  user: User;
  followers: User[];
  following: User[];
  ownProfile: boolean;
}

/**
 *
 * @param user
 * @param followers
 * @param following
 * @param ownProfile
 */
const UserProfile: React.FunctionComponent<UserProfileProps> = ({
  user,
  followers,
  following,
  ownProfile,
}) => {
  // Auth Redux Store.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // Following/Follower State.
  const [displayMode, setDisplayMode] = useState('follower');

  // Check Following State.
  const [isFollowing, setIsFollowing] = useState(
    followers.find((user) => user.id === auth.loggedInUser.id) ? true : false
  );

  // Followers state.
  const [followersState, setFollowersState] = useState(followers);

  // History, Disclosure and Toast Hooks
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Show Followers Function
   */
  const showFollowers = () => {
    setDisplayMode('follower');
    onOpen();
  };

  /**
   * Show Following Function
   */
  const showFollowing = () => {
    setDisplayMode('following');
    onOpen();
  };

  /**
   * Function to follow or unfollow user.
   */
  const followOrUnfollowUser = async () => {
    try {
      // If already following, unfollow the user else follow the user.
      if (isFollowing) {
        await FollowService.unfollowUser(user.id);
        setFollowersState(
          followers.filter((follower) => follower.id !== auth.loggedInUser.id)
        );
      } else {
        await FollowService.followUser(user.id);
        setFollowersState([...followersState, auth.loggedInUser]);
      }

      // Toast the user success message.
      toast({
        title: 'Success',
        description: `Successfully ${
          isFollowing ? 'unfollowed' : 'followed'
        } the user!!🌟`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Save opposite state to following state.
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      // Display error messages.
      toast({
        title: 'Error Occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const startChat = async () => {
    try {
      const createThreadDto = CreateThreadDto.newCreateThreadDto([
        auth.loggedInUser.id,
        user.id,
      ]);

      const threadId = await ChatService.createNewThread(createThreadDto);

      history.push(`/threads/${threadId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify={{ base: 'center', lg: 'space-evenly' }}
        align={{ base: 'center', lg: 'flex-start' }}
        w={{ base: '100%', lg: '60%' }}
        boxShadow='0 4px 8px 0 rgba(0,0,0,0.5)'
        borderRadius='lg'
        py={5}
      >
        <Avatar
          name={`${user.firstName} ${user.lastName}`}
          src={user.imageUrl}
          size='2xl'
        />

        <Flex direction='column' align='center' justify='center' w='210px'>
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
            <Flex flexDirection='row' justify='space-evenly' align='center'>
              <Button onClick={followOrUnfollowUser} variant='ghost'>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
              <Button onClick={startChat} variant='ghost'>
                Chat
              </Button>
            </Flex>
          )}
          {ownProfile && (
            <Button
              variant='ghost'
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
