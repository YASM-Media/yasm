import { Flex, Avatar, Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Thread } from '../../models/thread.model';
import { User } from '../../models/user.model';
import { AuthState } from '../../store/auth/types';
import * as userService from './../../store/user/service';

export interface ThreadTileProps {
  thread: Thread;
}

const ThreadTile: React.FC<ThreadTileProps> = ({ thread }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    setLoading(true);

    const userId = thread.participants.filter(
      (id) => id !== auth.loggedInUser.id
    )[0];

    userService
      .getUserDetails(userId)
      .then((fetchedUser) => setUser(fetchedUser))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [thread]);

  const checkUnread =
    thread.seen.filter((id) => id === auth.loggedInUser.id).length === 0;

  const loadingTile = () => (
    <Flex direction='row' justify='space-evenly' align='center'>
      <Avatar />
      <Flex direction='column'>
        <Box bg='gray.400' w='5em' h='0.3em' m='0.2em' />
        <Box bg='gray.400' w='10em' h='0.3em' m='0.2em' />
        <Box bg='gray.400' w='10em' h='0.3em' m='0.2em' />
      </Flex>
    </Flex>
  );

  const loadedTile = () => (
    <Flex direction='row' justify='space-evenly' align='center' m='0.7em'>
      <Avatar
        src={user?.imageUrl}
        name={`${user?.firstName} ${user?.lastName}`}
        marginX='0.5em'
      />
      <Flex direction='column'>
        <Box w='10em' m='0.01em'>
          <Text>
            {user?.firstName} {user?.lastName}
          </Text>
        </Box>
        <Box w='10em' m='0.01em'>
          <Text fontSize='xs' color='gray'>
            {thread.messages[thread.messages.length - 1].message}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );

  return loading ? loadingTile() : loadedTile();
};

export default ThreadTile;
