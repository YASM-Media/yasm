import { IconButton, Box } from '@chakra-ui/react';
import React from 'react';
import { IoAdd } from 'react-icons/io5';

export interface FABProps {
  onClick: () => void;
}

const FAB: React.FunctionComponent<FABProps> = ({ onClick }) => {
  return (
    <Box position='fixed' right={10} bottom={10}>
      <IconButton
        aria-label='FAB'
        bgColor={{ sm: 'white' }}
        color={{ base: 'white', sm: 'pink.500' }}
        size='lg'
        isRound={true}
        icon={<IoAdd />}
        onClick={onClick}
      />
    </Box>
  );
};

export default FAB;
