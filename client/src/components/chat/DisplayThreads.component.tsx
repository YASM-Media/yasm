import { Portal, Box } from '@chakra-ui/react';
import { Thread } from '../../models/thread.model';
import ThreadList from './ThreadList.component';

export interface DisplayThreadsProps {
  containerRef: React.RefObject<HTMLElement | null>;
  threads: Thread[];
  display: boolean;
}

const DisplayThreads: React.FC<DisplayThreadsProps> = ({
  containerRef,
  display,
  threads,
}) => {
  return (
    <Portal containerRef={containerRef}>
      <Box display={!display ? 'none' : 'block'}>
        <Box
          position='absolute'
          bgColor='white'
          w='19em'
          zIndex={99}
          maxH='sm'
          overflowY='scroll'
          overflowX='hidden'
        >
          <ThreadList threads={threads} />
        </Box>
      </Box>
    </Portal>
  );
};

export default DisplayThreads;
