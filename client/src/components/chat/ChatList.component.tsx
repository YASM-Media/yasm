import { Box, Flex } from '@chakra-ui/react';
import useWindowDimensions from '../../hooks/useWindowDimensions.hook';
import { Chat } from '../../models/chat.model';
import ChatBubble from './ChatBubble.component';

export interface ChatListProps {
  messages: Chat[];
  threadId: string;
}

const ChatList: React.FC<ChatListProps> = ({ messages, threadId }) => {
  const { height } = useWindowDimensions();

  return (
    <Flex direction='column' justify='flex-end' h={height * 0.8}>
      <Box overflowY='scroll'>
        {messages.map((message) => (
          <ChatBubble key={message.id} chat={message} threadId={threadId} />
        ))}
      </Box>
    </Flex>
  );
};

export default ChatList;
