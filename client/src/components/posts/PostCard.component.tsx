import { Avatar, Box, Flex, IconButton, Link, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../models/post.model';
import ImageCarousel from '../utility/ImageCarousel.component';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { RootStateOrAny, useSelector } from 'react-redux';
import { AuthState } from '../../store/auth/types';
import * as LikeService from './../../store/likes/service';

export interface PostCardProps {
  post: Post;
}

/**
 * Post Card Component.
 * @param post Post object
 */
const PostCard: React.FunctionComponent<PostCardProps> = ({ post }) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // Likes and Liked states.
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(
    likes.find((like) => like.user.id === auth.loggedInUser.id) ? true : false
  );

  /**
   * Function for liking the post.
   */
  const likePost = async () => {
    // Get the like object after submitting like data to server
    const like = await LikeService.likePost(post.id);

    // Push the like object in likes state.
    setLikes([...likes, like]);

    // Set liked state as the opposite.
    setLiked(!liked);
  };

  /**
   * Function for unliking the post
   */
  const unlikePost = async () => {
    // Delete the like object from server.
    await LikeService.unlikePost(post.id);

    // Filter out the user like.
    setLikes(likes.filter((like) => like.user.id !== auth.loggedInUser.id));

    // Set liked state as the opposite.
    setLiked(!liked);
  };

  return (
    <React.Fragment>
      <Box
        borderWidth='1px'
        borderRadius='lg'
        borderColor='black'
        m={5}
        w={{ base: '80%', sm: '60%', md: '40%' }}
        h='100%'
      >
        <Link href={`/account/profile/${post.user.id}`}>
          <Flex direction='row' align='center' margin={3}>
            <Avatar
              marginRight={5}
              name={`${post.user.firstName} ${post.user.lastName}`}
              src={post.user.imageUrl}
              size='sm'
            />
            <Text fontSize='sm'>{`${post.user.firstName} ${post.user.lastName}`}</Text>
          </Flex>
        </Link>
        <ImageCarousel images={post.images} />
        <Flex direction='row' align='center'>
          <IconButton
            bgColor='transparent'
            aria-label='like'
            icon={
              liked ? <FaHeart color='red' /> : <FaRegHeart color='black' />
            }
            onClick={async () =>
              !liked ? await likePost() : await unlikePost()
            }
          />
          <IconButton
            bgColor='transparent'
            aria-label='comment'
            icon={<FaRegComment />}
          />
        </Flex>
        <Box marginX={3}>
          <Text fontWeight='600' fontSize='sm'>
            Liked by {likes.length} others
          </Text>
        </Box>
        <Box marginX={3} marginBottom={5}>
          <Text fontSize='sm'>{post.text}</Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PostCard;
