import { Flex, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../models/post.model';
import ConfirmationModal from '../modal/confirmationModal.component';
import PostCard from './PostCard.component';
import * as PostService from './../../store/post/service';
import NoData from '../lottie/NoData.animation';

export interface PostListProps {
  posts: Post[];
  removeFromArray: (postId: string) => void;
}

/**
 * Display the list of posts to the user.
 * @param posts Posts Array
 */
const PostList: React.FunctionComponent<PostListProps> = ({
  posts,
  removeFromArray,
}) => {
  // Toast Hook.
  const toast = useToast();

  // Disclosure Hook.
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [postId, setPostId] = useState('');

  const deletePost = async () => {
    try {
      if (postId === '') {
        return;
      }

      await PostService.deletePost(postId);

      removeFromArray(postId);

      onClose();

      // Toast the user success.
      toast({
        title: 'Success',
        description: 'Successfully deleted the post!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // Toast the user error.
      toast({
        title: 'Error Occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDeletePost = (id: string) => {
    setPostId(id);
    onOpen();
  };

  return (
    <React.Fragment>
      <Flex align='center' direction='column'>
        {posts.length > 0 &&
          posts.map((post) => (
            <PostCard
              onDelete={() => confirmDeletePost(post.id)}
              key={post.id}
              post={post}
            />
          ))}
        {posts.length === 0 && <NoData message='No Posts To Show!!🌟' />}
      </Flex>
      <ConfirmationModal
        onClose={onClose}
        isOpen={isOpen}
        onYes={deletePost}
        message='Are you sure you want to delete this post?'
      />
    </React.Fragment>
  );
};

export default PostList;
