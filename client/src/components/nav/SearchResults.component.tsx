import { Box, Flex, Portal, Text } from '@chakra-ui/react';
import React from 'react';
import { FaAlgolia } from 'react-icons/fa';
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
          <Flex justify='center' align='center' marginTop={2}>
            <Text fontSize='xs' color='grey'>
              Search Results Brought To You By Algolia
            </Text>
            <Box marginLeft={1}>
              <FaAlgolia color='#5468FF' />
            </Box>
          </Flex>
          {results.map((user) => (
            <SearchResult key={user.id} user={user} />
          ))}
        </Box>
      </Box>
    </Portal>
  );
};

export default SearchResults;
