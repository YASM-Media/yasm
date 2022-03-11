import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import { Post as PostModel } from '../../models/post.model';
import Post from './Post.component';

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
