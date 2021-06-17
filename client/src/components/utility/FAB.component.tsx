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
        size='lg'
        boxShadow='0 4px 8px 0 rgba(0,0,0,0.5)'
        isRound={true}
        icon={<IoAdd />}
        onClick={onClick}
      />
    </Box>
  );
};

export default FAB;
