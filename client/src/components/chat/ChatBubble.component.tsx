import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { DeleteMessageDto } from '../../dto/chat/delete-message.dto';
import { AuthState } from '../../store/auth/types';
import ConfirmationModal from '../modal/confirmationModal.component';
import { Chat } from './../../models/chat.model';
import * as chatService from './../../store/chat/service';

export interface ChatBubbleProps {
  chat: Chat;
  threadId: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ chat, threadId }) => {
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);
  const [startPress, setStartPress] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onChatMouseDown = () => {
    setStartPress(Date.now());
  };

  const onChatMouseUp = () => {
    if (Date.now() - startPress > 1000) {
      setModalOpen(true);
    }
  };

  const onDeleteMessage = async () => {
    await chatService.deleteMessage(
      DeleteMessageDto.newDeleteMessageDto(threadId, chat.id)
    );
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <Flex
        direction='row'
        justify={
          chat.userId === auth.loggedInUser.id ? 'flex-end' : 'flex-start'
        }
        onMouseDown={() =>
          chat.userId === auth.loggedInUser.id ? onChatMouseDown() : null
        }
        onMouseUp={() =>
          chat.userId === auth.loggedInUser.id ? onChatMouseUp() : null
        }
        cursor='pointer'
      >
        <Flex direction='column' justify='center' align='center' my='1em'>
          <Box
            p='1em'
            maxW='15em'
            minW='10em'
            bg={chat.userId === auth.loggedInUser.id ? 'gray.100' : 'pink.500'}
            borderRadius='0.5em'
          >
            <Text
              color={chat.userId === auth.loggedInUser.id ? 'black' : 'white'}
            >
              {chat.message}
            </Text>
          </Box>
          <Text>{chat.createdAt.toLocaleString()}</Text>
        </Flex>
      </Flex>
      <ConfirmationModal
        message='Are you sure you want to delete this message?'
        onYes={onDeleteMessage}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </React.Fragment>
  );
};

export default ChatBubble;
