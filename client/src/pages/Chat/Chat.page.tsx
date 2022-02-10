import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { DocumentData, DocumentSnapshot, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import ChatForm from '../../components/chat/ChatForm.component';
import ChatList from '../../components/chat/ChatList.component';
import useWindowDimensions from '../../hooks/useWindowDimensions.hook';
import { Thread } from '../../models/thread.model';
import { User } from '../../models/user.model';
import { AuthState } from '../../store/auth/types';
import * as chatService from './../../store/chat/service';
import * as userService from './../../store/user/service';

export interface ChatProps {
  threadId: string;
}

const Chat: React.FC<ChatProps> = ({ threadId }) => {
  const [thread, setThread] = useState<Thread>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);

  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  const { height } = useWindowDimensions();

  useEffect(() => {
    const threadsSubscription = onSnapshot(
      chatService.listenToThread(threadId),
      (documentSnapshot: DocumentSnapshot<DocumentData>) => {
        const rawThread = documentSnapshot.data();

        const fetchedThread = Thread.fromJson(rawThread);
        setThread(fetchedThread);

        chatService.markThreadSeen(fetchedThread);

        const userId = fetchedThread.participants.filter(
          (id) => id !== auth.loggedInUser.id
        )[0];

        userService
          .getUserDetails(userId)
          .then((fetchedUser) => setUser(fetchedUser))
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }
    );
    return threadsSubscription;
  }, [threadId, auth.loggedInUser.id]);

  const loadingTile = () => (
    <Flex direction='row' justify='space-evenly' align='center'>
      <Avatar />
      <Flex direction='column' justify='center' align='center'>
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
      </Flex>
    </Flex>
  );

  return (
    <React.Fragment>
      <Flex
        direction='column'
        w='100%'
        paddingX={{ base: '0', lg: '10em', xl: '25em' }}
      >
        <Box h={height * 0.08}>{loading ? loadingTile() : loadedTile()}</Box>
        <ChatList
          messages={thread ? thread.messages : []}
          threadId={threadId}
        />
        <ChatForm threadId={threadId} />
      </Flex>
    </React.Fragment>
  );
};

export default Chat;
