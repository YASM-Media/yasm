import { Avatar, Center, Flex, Image, Link, Text } from '@chakra-ui/react';
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
          <Link key={user.id} href={`/account/profile/${user.id}`}>
            <Flex
              w='100%'
              direction='row'
              justify='space-between'
              align='center'
              padding={5}
            >
              <Avatar
                name={`${user.firstName} ${user.lastName}`}
                src={user.imageUrl}
              />
              <Flex direction='column'>
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
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
