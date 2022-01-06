import React, { useState } from 'react';
import { Post } from '../../models/post.model';
import CommentCard from './CommentCard.component';
import * as CommentsService from './../../store/comments/service';
import { DeleteCommentType } from '../../types/comments/deleteComment.type';
import {
  useToast,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { User } from '../../models/user.model';
import CommentForm from './CommentForm.component';
import NoData from '../lottie/NoData.animation';

export interface CommentListProps {
  postId: string;
  comments: Post[];
  deleteCommentFromState: (commentId: string) => void;
  updateCommentInState: (comment: Post) => void;
}

const CommentList: React.FunctionComponent<CommentListProps> = ({
  postId,
  comments,
  deleteCommentFromState,
  updateCommentInState,
}) => {
  const [commentState, setCommentState] = useState<Post>(
    new Post(
      '',
      '',
      new Date(),
      new User('', '', '', '', '', '', [], []),
      [],
      [],
      []
    )
  );

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteComment = async (
    deleteCommentType: DeleteCommentType
  ): Promise<void> => {
    try {
      await CommentsService.deleteComment(deleteCommentType);

      deleteCommentFromState(deleteCommentType.commentId);
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
      {comments.length > 0 &&
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            postId={postId}
            comment={comment}
            deleteComment={deleteComment}
            updateComment={() => {
              setCommentState(comment);
              onOpen();
            }}
          />
        ))}
      {comments.length === 0 && <NoData message='No Comments!!🌟' />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CommentForm
              isEdit={true}
              comment={commentState}
              postId={postId}
              addCommentToState={(updatedComment: Post) => {
                updateCommentInState(updatedComment);
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default CommentList;
