import { Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Post } from '../../models/post.model';
import { AuthState } from '../../store/auth/types';
import * as LikeService from './../../store/likes/service';

export interface PostLikeDetailsProps {
  post: Post;
}

const PostLikeDetails: React.SFC<PostLikeDetailsProps> = ({ post }) => {
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
      <Flex direction='row' align='center'>
        <IconButton
          bgColor='transparent'
          aria-label='like'
          icon={liked ? <FaHeart color='red' /> : <FaRegHeart color='black' />}
          onClick={async () => (!liked ? await likePost() : await unlikePost())}
        />
        <Text fontWeight='600' fontSize='sm'>
          Liked by {likes.length} others
        </Text>
      </Flex>
    </React.Fragment>
  );
};

export default PostLikeDetails;
