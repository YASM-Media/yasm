import { Button, Flex, Image, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { User } from '../../models/user.model';
import CustomModal from '../modal/modal.component';
import UserList from './UserList.component';

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
  const [displayMode, setDisplayMode] = useState('follower');
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useSelector((state: RootStateOrAny) => state.auth);

  const check = followers.find((user) => user.uid === auth.loggedInUser.uid);

  const showFollowers = () => {
    setDisplayMode('follower');
    onOpen();
  };

  const showFollowing = () => {
    setDisplayMode('following');
    onOpen();
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
              <Text>{followers.length}</Text>
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
            <Button colorScheme='teal'>{check ? 'Unfollow' : 'Follow'}</Button>
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
          userList={displayMode === 'follower' ? followers : following}
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
