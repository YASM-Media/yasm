import { Box, Flex, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Post as PostModel } from '../../models/post.model';
import CommentForm from '../comments/CommentForm.component';
import CommentList from '../comments/CommentList.component';
import ImageCarousel from '../utility/ImageCarousel.component';
import PostDetails from './PostDetails.component';
import PostLikeDetails from './PostLikeDetails.component';
import * as PostsService from './../../store/post/service';
import ConfirmationModal from '../modal/confirmationModal.component';

export interface PostProps {
  post: PostModel;
  inModal: boolean;
  onClose: () => void;
}

const Post: React.FC<PostProps> = ({ post, inModal = false, onClose }) => {
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
      if (inModal) onClose();
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
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify='center'
        borderRadius='lg'
      >
        <Box w='100%'>
          <ImageCarousel images={post.images} />
        </Box>
        <Flex position='relative' w='100%' direction='column'>
          <Box overflowY='scroll' overflowX='visible' h='24em'>
            <PostDetails
              post={post}
              onDelete={deleteConfirmationDisclosure.onOpen}
            />
            <Box paddingX={5}>
              <CommentList
                postId={post.id}
                comments={comments}
                deleteCommentFromState={deleteCommentFromState}
                updateCommentInState={updateCommentInState}
              />
            </Box>
          </Box>
          <Box paddingX={5}>
            <PostLikeDetails post={post} />
          </Box>
          <CommentForm postId={post.id} addCommentToState={addCommentToState} />
        </Flex>
      </Flex>
      <ConfirmationModal
        isOpen={deleteConfirmationDisclosure.isOpen}
        onClose={deleteConfirmationDisclosure.onClose}
        message='Are you you want to delete this post?'
        onYes={deletePost}
      />
    </React.Fragment>
  );
};

export default Post;
