import { Box, Flex, Portal } from '@chakra-ui/react';
import { Thread } from '../../models/thread.model';
import ThreadTile from './ThreadTile.component';

export interface ThreadListProps {
  containerRef: React.RefObject<HTMLElement | null>;
  threads: Thread[];
  display: boolean;
}

const ThreadList: React.FC<ThreadListProps> = ({
  containerRef,
  threads,
  display,
}) => {
  return (
    <Portal containerRef={containerRef}>
      <Box display={!display ? 'none' : 'block'}>
        <Box
          position='absolute'
          bgColor='white'
          w='16em'
          zIndex={99}
          maxH='sm'
          overflowY='scroll'
        >
          {threads.length > 0 &&
            threads.map((thread) => (
              <ThreadTile key={thread.id} thread={thread} />
            ))}
        </Box>
      </Box>
    </Portal>
  );
};

export default ThreadList;
