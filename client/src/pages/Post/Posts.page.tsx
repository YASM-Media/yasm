import {
  useToast,
  Heading,
  Text,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Navbar from '../../components/nav/Navbar.component';
import PostList from '../../components/posts/PostList.component';
import FAB from '../../components/utility/FAB.component';
import { Post } from '../../models/post.model';
import { PostMode } from '../../types/posts/enums/PostMode.enum';
import * as PostService from './../../store/post/service';

export interface PostsProps {}

/**
 * Page Component for displaying posts.
 */
const Posts: React.FunctionComponent<PostsProps> = () => {
  // Loading and error states.
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Post Mode State.
  const [postsMode, setPostsMode] = useState<PostMode>(PostMode.NEW);

  // Posts array state.
  const [posts, setPosts] = useState<Post[]>([]);

  // Toast Hook.
  const toast = useToast();

  // History Hook.
  const history = useHistory();

  // Fetching posts everytime the post mode state.
  useEffect(() => {
    // Setting load state as true.
    setLoading(true);

    // Fetch the new or best posts.
    // Check for error and set error state.
    if (postsMode === PostMode.NEW) {
      PostService.fetchNewPosts()
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => setErrorMessage(error));
    } else {
      PostService.fetchBestPosts()
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => setErrorMessage(error));
    }

    // Set loading state as false.
    setLoading(false);
  }, [postsMode]);

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

  // Post Display Switch functions.
  const switchToNew = () => setPostsMode(PostMode.NEW);
  const switchToBest = () => setPostsMode(PostMode.BEST);

  /**
   * Remove post fro array for a given ID.
   * @param postId Post ID
   */
  const deletePostFromArray = (postId: string) =>
    setPosts(posts.filter((post) => post.id !== postId));

  return loading ? (
    <Heading>Loading</Heading>
  ) : (
    <React.Fragment>
      <Navbar />
      <Flex justify='space-evenly' align='center'>
        <Text>Show Posts By</Text>
        <Menu>
          <MenuButton as={Button} variant='ghost'>
            {postsMode === PostMode.BEST ? 'Best of the last 24h' : 'New'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={switchToBest}>Best of the last 24h</MenuItem>
            <MenuItem onClick={switchToNew}>New</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box marginX='50'>
        <PostList posts={posts} removeFromArray={deletePostFromArray} />
        <FAB onClick={() => history.push('/posts/create')} />
      </Box>
    </React.Fragment>
  );
};

export default Posts;
