import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { User } from '../../models/user.model';
import SearchResults from './SearchResults.component';
import * as SearchService from './../../store/search/service';

export interface SearchbarProps {}

const Searchbar: React.FunctionComponent<SearchbarProps> = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const containerRef = useRef(null);

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
      <Box ref={containerRef}>
        <InputGroup w={{ base: '10em', md: 'sm' }} size='sm'>
          <InputLeftElement
            pointerEvents='none'
            color='pink.500'
            children={<MdSearch />}
          />
          <Input
            placeholder='Search...'
            variant='outline'
            size='sm'
            value={searchText}
            onChange={fetchResults}
          />
        </InputGroup>
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
