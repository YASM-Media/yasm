import { Center, Flex, Image, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';

export interface UserListProps {
  userList: User[];
  emptyMessage: string;
}

const UserList: React.FunctionComponent<UserListProps> = ({
  userList,
  emptyMessage,
}) => {
  return (
    <div>
      {userList.length > 0 ? (
        userList.map((user) => (
          <Link key={user.uid} href={`/account/profile/${user.uid}`}>
            <Flex
              w='100%'
              direction='row'
              justify='space-evenly'
              align='center'
            >
              <Image src={user.imageUrl} borderRadius='full' boxSize='100px' />
              <Flex direction='column'>
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
                <Text>{user.biography}</Text>
              </Flex>
            </Flex>
          </Link>
        ))
      ) : (
        <Center m={10}>
          <h1>{emptyMessage}</h1>
        </Center>
      )}
    </div>
  );
};

export default UserList;
