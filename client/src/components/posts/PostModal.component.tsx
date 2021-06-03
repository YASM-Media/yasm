import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Post } from '../../models/post.model';
import { AuthState } from '../../store/auth/types';
import CommentList from '../comments/CommentList.component';
import ImageCarousel from '../utility/ImageCarousel.component';
import * as LikeService from './../../store/likes/service';

export interface PostModalProps {
  post: Post;
  visible: boolean;
  onClose: () => void;
}

const PostModal: React.FunctionComponent<PostModalProps> = ({
  post,
  visible,
  onClose,
}) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // Likes and Liked states.
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(
    likes.find((like) => like.user.id === auth.loggedInUser.id) ? true : false
  );

  // History Hook.
  const history = useHistory();
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
      <Modal onClose={onClose} size='6xl' isOpen={visible}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            <Flex direction={{ base: 'column', md: 'row' }} justify='center'>
              <Box w='100%'>
                <ImageCarousel images={post.images} />
              </Box>
              <Flex
                position='relative'
                w='100%'
                direction='column'
                margin={2.4}
              >
                <Flex
                  p={5}
                  w='100%'
                  justify='center'
                  borderBottomColor='blackAlpha.200'
                  borderBottomWidth={1}
                  h='fit-content'
                >
                  <Link href={`/account/profile/${post.user.id}`} w='100%'>
                    <Flex direction='row' align='center'>
                      <Avatar
                        marginRight={5}
                        name={`${post.user.firstName} ${post.user.lastName}`}
                        src={post.user.imageUrl}
                        size='md'
                      />
                      <Text fontSize='sm'>{`${post.user.firstName} ${post.user.lastName}`}</Text>
                    </Flex>
                  </Link>
                  {post.user.id === auth.loggedInUser.id && (
                    <Menu>
                      <MenuButton
                        bgColor='transparent'
                        as={IconButton}
                        icon={<BsThreeDotsVertical />}
                      />
                      <MenuList>
                        <MenuItem
                          onClick={() =>
                            history.push(`/posts/update/${post.id}`)
                          }
                        >
                          Update Post
                        </MenuItem>
                        <MenuItem>Delete Post</MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Flex>
                <Box
                  padding={2.5}
                  overflowY='scroll'
                  overflowX='visible'
                  h='xs'
                >
                  <Box padding={5}>
                    <Flex direction='column' justify='center'>
                      <Link
                        href={`/account/profile/${post.user.id}`}
                        w='fit-content'
                      >
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
                  <Box paddingX={5}>
                    <CommentList comments={post.comments} />
                  </Box>
                </Box>
                <Box p={2.5}>
                  <Flex direction='row' align='center'>
                    <IconButton
                      bgColor='transparent'
                      aria-label='like'
                      icon={
                        liked ? (
                          <FaHeart color='red' />
                        ) : (
                          <FaRegHeart color='black' />
                        )
                      }
                      onClick={async () =>
                        !liked ? await likePost() : await unlikePost()
                      }
                    />
                    <Text fontWeight='600' fontSize='sm'>
                      Liked by {likes.length} others
                    </Text>
                  </Flex>
                </Box>
                <Flex p={5}>
                  <Input placeholder='Your Comment...' />
                  <Button bgColor='transparent'>Post</Button>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default PostModal;
