import { Box, Portal } from '@chakra-ui/react';
import { Activity } from '../../models/activity.model';
import Loading from '../lottie/Loading.animation';
import ActivityList from './ActivityList.component';

export interface DisplayActivityProps {
  containerRef: React.RefObject<HTMLElement | null>;
  activities: Activity[];
  display: boolean;
  loading: boolean;
}

const DisplayActivity: React.FC<DisplayActivityProps> = ({
  containerRef,
  activities,
  display,
  loading,
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
          {loading ? (
            <Loading message='Loading activities for you' />
          ) : (
            <ActivityList activities={activities} />
          )}
        </Box>
      </Box>
    </Portal>
  );
};

export default DisplayActivity;
