import { Box, Flex, IconButton, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router';
import SearchList from '../../components/nav/SearchList.component';
import { User } from '../../models/user.model';
import * as SearchService from './../../store/search/service';

export interface SearchProps {}

const Search: React.FunctionComponent<SearchProps> = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

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
    <Flex padding={2} direction='column'>
      <Flex
        borderColor='blackAlpha.300'
        borderWidth={1}
        boxShadow='0 4px 8px 0 rgba(0,0,0,0.2)'
      >
        <IconButton
          variant='ghost'
          aria-label='go-back'
          icon={<MdArrowBack />}
          onClick={() => history.goBack()}
        />
        <Input
          placeholder='Search...'
          variant='unstyled'
          value={searchText}
          onChange={fetchResults}
        />
      </Flex>
      <Box
        display={
          !(searchText !== '' && searchResults.length >= 0) ? 'none' : 'block'
        }
      >
        <SearchList results={searchResults} />
      </Box>
    </Flex>
  );
};

export default Search;
