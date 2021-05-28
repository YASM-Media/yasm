import { Flex } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../models/post.model';
import PostCard from './PostCard.component';

export interface PostListProps {
  posts: Post[];
}

const PostList: React.FunctionComponent<PostListProps> = ({ posts }) => {
  return (
    <Flex h='100vh' align='center' direction='column'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Flex>
  );
};

export default PostList;
