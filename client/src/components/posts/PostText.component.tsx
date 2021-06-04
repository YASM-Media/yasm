import { Avatar, Box, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../models/post.model';

export interface PostTextProps {
  post: Post;
}

const PostText: React.FunctionComponent<PostTextProps> = ({ post }) => {
  return (
    <React.Fragment>
      <Box padding={5}>
        <Flex direction='column' justify='center'>
          <Link href={`/account/profile/${post.user.id}`} w='fit-content'>
            <Flex direction='row'>
              <Avatar
                marginRight={5}
                name={`${post.user.firstName} ${post.user.lastName}`}
                src={post.user.imageUrl}
                size='sm'
              />
              <Text fontSize='sm'>{`${post.user.firstName} ${post.user.lastName}`}</Text>
            </Flex>
          </Link>
          <Text>{post.text}</Text>
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default PostText;
