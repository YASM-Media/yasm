import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../models/post.model';
import MinifiedPost from '../posts/MinifiedPost.component';

export type UserPostsMinifiedProps = {
  posts: Post[];
};

/**
 * Display Minified version of posts.
 * @param posts Posts array
 */
const UserPostsMinified: React.FunctionComponent<UserPostsMinifiedProps> = ({
  posts,
}) => {
  return (
    <React.Fragment>
      <Flex justify='center' align='center' w={{ base: '100%', md: '80%' }}>
        <Wrap spacing={{ base: 1, lg: 5 }} w='100%' justify='center'>
          {posts.map((post) => (
            <WrapItem key={post.id} boxSize='30%'>
              <Box w='100%' h='100%'>
                <MinifiedPost post={post} />
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </React.Fragment>
  );
};

export default UserPostsMinified;
