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
import { Post as PostModel } from '../../models/post.model';
import CommentForm from '../comments/CommentForm.component';
import CommentList from '../comments/CommentList.component';
import ConfirmationModal from '../modal/confirmationModal.component';
import ImageCarousel from '../utility/ImageCarousel.component';
import * as PostsService from './../../store/post/service';
import Post from './Post.component';
import PostDetails from './PostDetails.component';
import PostLikeDetails from './PostLikeDetails.component';

export interface PostModalProps {
  post: PostModel;
  visible: boolean;
  onClose: () => void;
}

const PostModal: React.FunctionComponent<PostModalProps> = ({
  post,
  visible,
  onClose,
}) => {
  // Post State.
  const [comments, setComments] = useState<PostModel[]>(post.comments);

  // History Hook.
  const history = useHistory();

  // Delete Confirmation Disclosure Hook.
  const deleteConfirmationDisclosure = useDisclosure();

  // Toast Hook.
  const toast = useToast();

  const addCommentToState = (comment: PostModel) => {
    setComments([...comments, comment]);
  };

  const updateCommentInState = (comment: PostModel) => {
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
    } catch (error: any) {
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
            <Post post={post} inModal={true} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default PostModal;
