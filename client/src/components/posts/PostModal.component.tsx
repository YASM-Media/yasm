import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Post } from '../../models/post.model';
import CommentForm from '../comments/CommentForm.component';
import CommentList from '../comments/CommentList.component';
import ConfirmationModal from '../modal/confirmationModal.component';
import ImageCarousel from '../utility/ImageCarousel.component';
import * as PostsService from './../../store/post/service';
import PostDetails from './PostDetails.component';
import PostLikeDetails from './PostLikeDetails.component';
import PostText from './PostText.component';

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
  // Post State.
  const [comments, setComments] = useState<Post[]>(post.comments);

  // History Hook.
  const history = useHistory();

  // Delete Confirmation Disclosure Hook.
  const deleteConfirmationDisclosure = useDisclosure();

  // Toast Hook.
  const toast = useToast();

  const addCommentToState = (comment: Post) => {
    setComments([...comments, comment]);
  };

  const updateCommentInState = (comment: Post) => {
    let commentPost = comments.find((c) => c.id === comment.id);
    if (commentPost) {
      commentPost.text = comment.text;
    }
    setComments(comments);
  };

  const deleteCommentFromState = (commentId: string) =>
    setComments(comments.filter((comment) => comment.id !== commentId));

  const deletePost = async () => {
    try {
      onClose();
      await PostsService.deletePost(post.id);
      deleteConfirmationDisclosure.onClose();

      toast({
        title: 'Success!',
        description: 'Post Successfully Deleted!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      history.go(0);
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <React.Fragment>
      <Modal onClose={onClose} size='5xl' isOpen={visible}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={0}>
            <Flex direction={{ base: 'column', lg: 'row' }} justify='center'>
              <Box w='100%'>
                <ImageCarousel images={post.images} />
              </Box>
              <Flex position='relative' w='100%' direction='column'>
                <Flex
                  p={5}
                  w='100%'
                  justify='center'
                  borderBottomColor='blackAlpha.200'
                  borderBottomWidth={1}
                  h='fit-content'
                >
                  <PostDetails
                    post={post}
                    onDelete={deleteConfirmationDisclosure.onOpen}
                  />
                </Flex>
                <Box
                  padding={2.5}
                  overflowY='scroll'
                  overflowX='visible'
                  h='2xs'
                >
                  <PostText post={post} />
                  <Box paddingX={5}>
                    <CommentList
                      postId={post.id}
                      comments={comments}
                      deleteCommentFromState={deleteCommentFromState}
                      updateCommentInState={updateCommentInState}
                    />
                  </Box>
                </Box>
                <Box p={2.5}>
                  <PostLikeDetails post={post} />
                </Box>
                <CommentForm
                  postId={post.id}
                  addCommentToState={addCommentToState}
                />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmationModal
        isOpen={deleteConfirmationDisclosure.isOpen}
        onClose={deleteConfirmationDisclosure.onClose}
        message='Are you you want to delete this post?'
        onYes={deletePost}
      />
    </React.Fragment>
  );
};

export default PostModal;
