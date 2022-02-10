import { Avatar, AvatarBadge, IconButton, Stack } from '@chakra-ui/react';
import { DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Thread } from '../../models/thread.model';
import { BsChatFill } from 'react-icons/bs';
import * as chatService from './../../store/chat/service';
import { AuthState } from '../../store/auth/types';
import { RootStateOrAny, useSelector } from 'react-redux';

const NavChat: React.FunctionComponent = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  useEffect(() => {
    const threadsSubscription = onSnapshot(
      chatService.listenToThreads(),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const threads = querySnapshot.docs.map((thread) =>
          Thread.fromJson(thread.data())
        );

        let count = 0;

        threads.forEach((thread) => {
          if (
            thread.seen.filter((id) => id === auth.loggedInUser.id).length === 0
          ) {
            count += 1;
          }
        });

        setUnreadCount(count);
      }
    );

    return threadsSubscription;
  }, []);

  return (
    <Stack direction='row' spacing={4}>
      <Avatar
        icon={<BsChatFill color='white' size='1.75em' />}
        size='sm'
        backgroundColor='transparent'
      >
        {unreadCount > 0 && (
          <AvatarBadge boxSize='1.5em' bg='pink.600' color='white'>
            {unreadCount}
          </AvatarBadge>
        )}
      </Avatar>
    </Stack>
  );
};

export default NavChat;
