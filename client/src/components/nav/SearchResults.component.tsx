import { Box, Portal } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';
import SearchList from './SearchList.component';

export interface SearchResultsProps {
  containerRef: React.MutableRefObject<any>;
  results: User[];
  displayResults: boolean;
}

const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
  containerRef,
  results,
  displayResults,
}) => {
  return (
    <Portal containerRef={containerRef}>
      <Box position='relative' display={!displayResults ? 'none' : 'block'}>
        <Box
          position='absolute'
          bgColor='white'
          w='100%'
          zIndex={99}
          maxH='sm'
          overflowY='scroll'
        >
          <SearchList results={results} />
        </Box>
      </Box>
    </Portal>
  );
};

export default SearchResults;
