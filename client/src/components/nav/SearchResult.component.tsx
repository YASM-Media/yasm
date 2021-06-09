import { Avatar, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';

export interface SearchResultProps {
  user: User;
}

const SearchResult: React.FunctionComponent<SearchResultProps> = ({ user }) => {
  return (
    <React.Fragment>
      <Link href={`/account/profile/${user.id}`}>
        <Flex
          justify='space-between'
          align='center'
          padding={5}
          borderBottomColor='grey.700'
          borderBottomWidth={1}
        >
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            size='sm'
            src={user.imageUrl}
          />
          <Text>{`${user.firstName} ${user.lastName}`}</Text>
        </Flex>
      </Link>
    </React.Fragment>
  );
};

export default SearchResult;
