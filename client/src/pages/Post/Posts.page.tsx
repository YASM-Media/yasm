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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PostList from '../../components/posts/PostList.component';
import { Post } from '../../models/post.model';
import { PostMode } from '../../types/posts/enums/PostMode.enum';
import * as PostService from './../../store/post/service';

export interface PostsProps {}

const Posts: React.FunctionComponent<PostsProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [postsMode, setPostsMode] = useState<PostMode>(PostMode.NEW);
  const [posts, setPosts] = useState<Post[]>([]);

  const toast = useToast();

  useEffect(() => {
    setLoading(true);
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

    setLoading(false);
  }, [postsMode]);

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

  const switchToNew = () => setPostsMode(PostMode.NEW);
  const switchToBest = () => setPostsMode(PostMode.BEST);

  return loading ? (
    <Heading>Loading</Heading>
  ) : (
    <React.Fragment>
      <Flex justify='center' align='center'>
        <Text>Show Posts By</Text>
        <Menu>
          <MenuButton bgColor='transparent' as={Button}>
            {postsMode === PostMode.BEST ? 'Best of the last 24h' : 'New'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={switchToBest}>Best of the last 24h</MenuItem>
            <MenuItem onClick={switchToNew}>New</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <PostList posts={posts} />
    </React.Fragment>
  );
};

export default Posts;
