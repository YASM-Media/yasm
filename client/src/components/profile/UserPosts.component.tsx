import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import Loading from '../lottie/Loading.animation';
import PostList from '../posts/PostList.component';
import * as PostService from './../../store/post/service';
import UserPostsMinified from './UserPostsMinified.component';

export interface UserPostsProps {
  user: User;
}

const UserPosts: React.FunctionComponent<UserPostsProps> = ({ user }) => {
  // Loading and error states.
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);

  // Toast Hook.
  const toast = useToast();

  // Fetching user posts from server.
  useEffect(() => {
    setLoading(true);

    PostService.fetchPostsByUser(user.id)
      .then((data) => setPosts(data))
      .catch((error) => setErrorMessage(error))
      .finally(() => setLoading(false));
  }, [user.id]);

  // Listening to error state to display errors.
  useEffect(() => {
    if (errorMessage !== '') {
      toast({
        title: 'An Error Occured!',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => setErrorMessage(''),
      });
    }
  }, [errorMessage, toast]);

  const deletePostFromArray = (postId: string) =>
    setPosts(posts.filter((post) => post.id !== postId));

  return !loading ? (
    <React.Fragment>
      <Box w='100%' marginY={50}>
        <Tabs variant='soft-rounded' align='center'>
          <TabList>
            <Tab>
              <Text>Overview</Text>
            </Tab>
            <Tab>All Posts</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserPostsMinified posts={posts} />
            </TabPanel>
            <TabPanel>
              <Box paddingX={{ base: 0, md: 50, lg: 200 }}>
                <PostList posts={posts} removeFromArray={deletePostFromArray} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </React.Fragment>
  ) : (
    <Loading message='Loading User Posts For You!!🌟' />
  );
};

export default UserPosts;
