import React from 'react';
import { Post } from '../../models/post.model';
import CommentCard from './CommentCard.component';

export interface CommentListProps {
  comments: Post[];
}

const CommentList: React.FunctionComponent<CommentListProps> = ({
  comments,
}) => {
  return (
    <React.Fragment>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </React.Fragment>
  );
};

export default CommentList;
