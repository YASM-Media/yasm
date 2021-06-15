import { Avatar, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';
import NoData from '../lottie/NoData.animation';

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
        <NoData message='User Data Not Available!!🌟' />
      )}
    </div>
  );
};

export default UserList;
