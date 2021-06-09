import { Box, Portal } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';
import SearchResult from './SearchResult.component';

export interface SearchResultsProps {
  containerRef: React.MutableRefObject<any>;
  results: User[];
}

const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
  containerRef,
  results,
}) => {
  return (
    <Portal containerRef={containerRef}>
      <Box
        position='relative'
        display={results.length === 0 ? 'none' : 'block'}
      >
        <Box
          position='absolute'
          bgColor='white'
          w='100%'
          zIndex={99}
          height='2xs'
          overflowY='scroll'
        >
          {results.map((user) => (
            <SearchResult key={user.id} user={user} />
          ))}
        </Box>
      </Box>
    </Portal>
  );
};

export default SearchResults;
