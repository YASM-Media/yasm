import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { User } from '../../models/user.model';
import SearchResults from './SearchResults.component';
import * as SearchService from './../../store/search/service';
import { useHistory } from 'react-router';

export interface SearchbarProps {}

const Searchbar: React.FunctionComponent<SearchbarProps> = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const containerRef = useRef(null);
  const history = useHistory();

  const fetchResults = async (event: any): Promise<void> => {
    try {
      const searchString: string = event.target.value;

      setSearchText(searchString);

      if (searchString !== '')
        setSearchResults(await SearchService.searchForUsers(searchString));
      else setSearchResults([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Box ref={containerRef} display={{ base: 'none', md: 'block' }}>
        <InputGroup w={{ base: '10em', md: 'sm' }} size='sm'>
          <InputLeftElement
            pointerEvents='none'
            color='pink.500'
            children={<MdSearch />}
          />
          <Input
            color='white'
            placeholder='Search...'
            variant='filled'
            size='sm'
            value={searchText}
            onChange={fetchResults}
            borderRadius='xl'
          />
        </InputGroup>
      </Box>
      <Box
        display={{ base: 'block', md: 'none' }}
        w={{ base: '10em', sm: 'sm' }}
        bgColor='white'
        borderRadius='xl'
        onClick={() => history.push('/search')}
      >
        <Flex align='center' justify='flex-start'>
          <Box marginX={2} color='pink.500'>
            <MdSearch />
          </Box>
          <Box>
            <Text color='grey'>Search...</Text>
          </Box>
        </Flex>
      </Box>
      <SearchResults
        containerRef={containerRef}
        results={searchResults}
        displayResults={searchText !== '' && searchResults.length >= 0}
      />
    </React.Fragment>
  );
};

export default Searchbar;
