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
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../models/post.model';
import ImageCarousel from '../utility/ImageCarousel.component';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RootStateOrAny, useSelector } from 'react-redux';
import { AuthState } from '../../store/auth/types';
import * as LikeService from './../../store/likes/service';
import { useHistory } from 'react-router';
import PostModal from './PostModal.component';

export interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

/**
 * Post Card Component.
 * @param post Post object
 */
const PostCard: React.FunctionComponent<PostCardProps> = ({
  post,
  onDelete,
}) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // History Hook.
  const history = useHistory();

  // Likes and Liked states.
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(
    likes.find((like) => like.user.id === auth.loggedInUser.id) ? true : false
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        w={{ base: '100%', sm: '70%', lg: '35%' }}
      >
        <Flex margin={3} direction='row' justify='space-between'>
          <Link href={`/account/profile/${post.user.id}`} w='fit-content'>
            <Flex direction='row' align='center'>
              <Avatar
                marginRight={5}
                name={`${post.user.firstName} ${post.user.lastName}`}
                src={post.user.imageUrl}
                size='sm'
              />
              <Text fontSize='sm'>{`${post.user.firstName} ${post.user.lastName}`}</Text>
            </Flex>
          </Link>
          {post.user.id === auth.loggedInUser.id && (
            <Menu>
              <MenuButton
                variant='ghost'
                as={IconButton}
                icon={<BsThreeDotsVertical />}
              />
              <MenuList>
                <MenuItem
                  onClick={() => history.push(`/posts/update/${post.id}`)}
                >
                  Update Post
                </MenuItem>
                <MenuItem onClick={onDelete}>Delete Post</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
        <ImageCarousel images={post.images} />
        <Flex direction='row' align='center'>
          <IconButton
            bgColor='transparent'
            aria-label='like'
            color='pink.500'
            variant='ghost'
            icon={liked ? <FaHeart /> : <FaRegHeart />}
            onClick={async () =>
              !liked ? await likePost() : await unlikePost()
            }
          />
          <IconButton
            bgColor='transparent'
            aria-label='comment'
            color='pink.500'
            variant='ghost'
            icon={<FaRegComment />}
            onClick={onOpen}
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
      <PostModal post={post} visible={isOpen} onClose={onClose} />
    </React.Fragment>
  );
};

export default PostCard;
