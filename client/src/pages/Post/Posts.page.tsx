import {
  useToast,
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
import Loading from '../../components/lottie/Loading.animation';
import Navbar from '../../components/nav/Navbar.component';
import PostList from '../../components/posts/PostList.component';
import SuggestedUsers from '../../components/user/SuggestedUsers.component';
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
    } else if (postsMode === PostMode.BEST) {
      PostService.fetchBestPosts()
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => setErrorMessage(error));
    } else if (postsMode === PostMode.SUGGESTED) {
      PostService.fetchSuggestedPosts()
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
  const switchToSuggested = () => setPostsMode(PostMode.SUGGESTED);

  /**
   * Remove post from array for a given ID.
   * @param postId Post ID
   */
  const deletePostFromArray = (postId: string) =>
    setPosts(posts.filter((post) => post.id !== postId));

  return loading ? (
    <Loading message='Loading Posts For You!!🌟' />
  ) : (
    <React.Fragment>
      <Navbar />
      <Flex direction='row' justify='center' align='flex-start'>
        <Box
          minW={{ base: '100%', xl: '70%' }}
          maxW={{ base: '100%', xl: '70%' }}
          paddingX={30}
        >
          <Flex
            justify='space-between'
            align='center'
            paddingX={{ base: 1, sm: 0, md: 110, lg: 180 }}
          >
            <Text>Show Posts By</Text>
            <Menu>
              <MenuButton as={Button} variant='ghost'>
                {postsMode === PostMode.BEST
                  ? 'Best of the last 24h'
                  : postsMode === PostMode.SUGGESTED
                  ? 'Suggested'
                  : 'New'}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={switchToBest}>Best of the last 24h</MenuItem>
                <MenuItem onClick={switchToNew}>New</MenuItem>
                <MenuItem onClick={switchToSuggested}>Suggested</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box paddingX={{ md: 100, lg: 200, xl: 0 }}>
            <PostList posts={posts} removeFromArray={deletePostFromArray} />
          </Box>
        </Box>
        <Box w='100%' display={{ base: 'none', xl: 'block' }}>
          <SuggestedUsers />
        </Box>
      </Flex>
      <FAB onClick={() => history.push('/posts/create')} />
    </React.Fragment>
  );
};

export default Posts;
