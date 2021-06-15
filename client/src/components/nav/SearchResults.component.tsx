import { Box, Flex, Portal, Text } from '@chakra-ui/react';
import React from 'react';
import { FaAlgolia } from 'react-icons/fa';
import { User } from '../../models/user.model';
import NoData from '../lottie/NoData.animation';
import SearchResult from './SearchResult.component';

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
          <Flex justify='center' align='center' marginTop={2}>
            <Text fontSize='xs' color='grey'>
              Search Results Brought To You By Algolia
            </Text>
            <Box marginLeft={1}>
              <FaAlgolia color='#5468FF' />
            </Box>
          </Flex>
          {results.length > 0 &&
            results.map((user) => <SearchResult key={user.id} user={user} />)}
          {results.length === 0 && (
            <NoData message='No User Data Present!!🌟' />
          )}
        </Box>
      </Box>
    </Portal>
  );
};

export default SearchResults;
