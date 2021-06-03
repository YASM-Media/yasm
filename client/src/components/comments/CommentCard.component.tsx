import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Post } from '../../models/post.model';
import { AuthState } from '../../store/auth/types';
import ImageCarousel from '../utility/ImageCarousel.component';
import * as LikeService from './../../store/likes/service';

export interface CommentCardProps {
  comment: Post;
}

const CommentCard: React.FunctionComponent<CommentCardProps> = ({
  comment,
}) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // History Hook.
  const history = useHistory();

  // Likes and Liked states.
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(
    likes.find((like) => like.user.id === auth.loggedInUser.id) ? true : false
  );

  /**
   * Function for liking the post.
   */
  const likePost = async () => {
    // Get the like object after submitting like data to server
    const like = await LikeService.likePost(comment.id);

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
    await LikeService.unlikePost(comment.id);

    // Filter out the user like.
    setLikes(likes.filter((like) => like.user.id !== auth.loggedInUser.id));

    // Set liked state as the opposite.
    setLiked(!liked);
  };

  return (
    <React.Fragment>
      <Flex direction='row' justify='space-between' marginY={5}>
        <Flex direction='column' justify='center'>
          <Link href={`/account/profile/${comment.user.id}`} w='fit-content'>
            <Flex direction='row'>
              <Avatar
                marginRight={5}
                name={`${comment.user.firstName} ${comment.user.lastName}`}
                src={comment.user.imageUrl}
                size='sm'
              />
              <Text fontSize='sm'>{`${comment.user.firstName} ${comment.user.lastName}`}</Text>
            </Flex>
          </Link>
          <Text>{comment.text}</Text>
        </Flex>

        <Flex>
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
          {comment.user.id === auth.loggedInUser.id && (
            <Menu>
              <MenuButton
                bgColor='transparent'
                as={IconButton}
                icon={<BsThreeDotsVertical />}
              />
              <MenuList>
                <MenuItem
                  onClick={() => history.push(`/posts/update/${comment.id}`)}
                >
                  Update Post
                </MenuItem>
                <MenuItem>Delete Post</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default CommentCard;
