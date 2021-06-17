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
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Post } from '../../models/post.model';
import { AuthState } from '../../store/auth/types';
import { DeleteCommentType } from '../../types/comments/deleteComment.type';
import * as LikeService from './../../store/likes/service';

export interface CommentCardProps {
  postId: string;
  comment: Post;
  deleteComment: (deleteCommentType: DeleteCommentType) => Promise<void>;
  updateComment: () => void;
}

const CommentCard: React.FunctionComponent<CommentCardProps> = ({
  postId,
  comment,
  deleteComment,
  updateComment,
}) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

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
      <Flex direction='row' justify='space-between' marginY={5} w='100%'>
        <Flex direction='column' justify='center' w='100%'>
          <Flex direction='row' w='100%'>
            <Link href={`/account/profile/${comment.user.id}`} w='fit-content'>
              <Avatar
                marginRight={5}
                name={`${comment.user.firstName} ${comment.user.lastName}`}
                src={comment.user.imageUrl}
                size='md'
              />
            </Link>
            <Flex direction='column' w='100%'>
              <Link
                href={`/account/profile/${comment.user.id}`}
                w='fit-content'
              >
                <Text
                  fontSize='lg'
                  fontWeight='semibold'
                >{`${comment.user.firstName} ${comment.user.lastName}`}</Text>
              </Link>
              <Flex direction='row' justify='space-between' w='100%'>
                <Box w='60%'>
                  <Text paddingTop={1}>{comment.text}</Text>
                </Box>
                <Box>
                  <IconButton
                    bgColor='transparent'
                    aria-label='like'
                    variant='ghost'
                    color='pink.500'
                    icon={liked ? <FaHeart /> : <FaRegHeart />}
                    onClick={async () =>
                      !liked ? await likePost() : await unlikePost()
                    }
                  />
                  {comment.user.id === auth.loggedInUser.id && (
                    <Menu>
                      <MenuButton
                        variant='ghost'
                        color='pink.500'
                        as={IconButton}
                        icon={<BsThreeDotsVertical />}
                      />
                      <MenuList>
                        <MenuItem onClick={updateComment}>
                          Update Comment
                        </MenuItem>
                        <MenuItem
                          onClick={async () =>
                            await deleteComment({
                              postId,
                              commentId: comment.id,
                            })
                          }
                        >
                          Delete Comment
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex></Flex>
      </Flex>
    </React.Fragment>
  );
};

export default CommentCard;
