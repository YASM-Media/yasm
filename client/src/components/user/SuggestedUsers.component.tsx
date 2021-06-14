import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { User } from '../../models/user.model';
import * as AuthService from '../../store/auth/service';
import SuggestedUser from './SuggestedUser.component';

export interface SuggestedUsersProps {}

const SuggestedUsers: React.FunctionComponent<SuggestedUsersProps> = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    AuthService.fetchSuggestedPosts()
      .then((usersArray) => setUsers(usersArray))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box paddingY={2} w='100%'>
      <Text color='pink.500'>Suggested Users To Follow!</Text>
      {users.map((user) => (
        <SuggestedUser key={user.id} user={user} />
      ))}
    </Box>
  );
};

export default SuggestedUsers;
