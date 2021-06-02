import { Box, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { Post } from '../../models/post.model';
import { BsFillGridFill } from 'react-icons/bs';

export type MinifiedPostProps = {
  post: Post;
};

/**
 * Component to display minified versions of posts.
 * @param post Post Object
 */
const MinifiedPost: React.FunctionComponent<MinifiedPostProps> = ({ post }) => {
  return (
    <React.Fragment>
      <Box
        w='100%'
        h='100%'
        position='relative'
        justifyContent='center'
        alignItems='center'
      >
        <Image
          objectFit='cover'
          width='100%'
          height='100%'
          src={post.images[0].imageUrl}
        />
        {post.images.length > 1 && (
          <Flex position='absolute' top='0%' left='0%' w='100%' h='100%' p={1}>
            <BsFillGridFill color='white' />
          </Flex>
        )}
      </Box>
    </React.Fragment>
  );
};

export default MinifiedPost;
