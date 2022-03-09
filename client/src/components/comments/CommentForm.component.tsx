import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import * as yup from 'yup';
import CustomModal from '../modal/modal.component';
import { useFormik } from 'formik';
import { UpdateCommentType } from '../../types/comments/updateComment.type';
import { CreateCommentType } from '../../types/comments/createComment.type';
import * as CommentService from './../../store/comments/service';
import Loading from '../lottie/Loading.animation';

export interface CommentFormProps {
  isEdit?: boolean;
  comment?: Post;
  postId: string;
  addCommentToState: (comment: Post) => void;
}

type FormAttributes = {
  text: string;
};

const CommentForm: React.FunctionComponent<CommentFormProps> = ({
  isEdit = false,
  postId,
  comment = new Post('', '', new Date(), User.newEmptyUser(), [], [], []),
  addCommentToState,
}) => {
  const [commentState] = useState(comment);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  // Validation Schema for the form.
  const validationSchema = yup.object().shape({
    text: yup.string().required(),
  });

  const onSubmit = async (values: FormAttributes): Promise<void> => {
    // Set loading state as true.
    setLoading(true);
    try {
      if (isEdit) {
        const updateCommentType: UpdateCommentType = {
          id: commentState.id,
          text: values.text,
        };

        const updatedComment = await CommentService.updateComment(
          updateCommentType
        );

        addCommentToState(updatedComment);
      } else {
        const createCommentType: CreateCommentType = {
          postId: postId,
          text: values.text,
        };

        const comment = await CommentService.createComment(createCommentType);

        addCommentToState(comment);
      }

      // Set loading state as false
      setLoading(false);

      // Toast the user success.
      toast({
        title: 'Success',
        description: !isEdit
          ? 'Successfully created a new comment!!🌟'
          : 'Successfully updated your comment!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      // Set loading state as false.
      setLoading(false);

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      text: commentState.text,
    },
    validationSchema,
    onSubmit,
  });

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Flex p={5}>
          <FormControl isRequired isInvalid={formik.errors.text ? true : false}>
            <Input
              type='text'
              placeholder='Your Comment...'
              value={formik.values.text}
              onChange={formik.handleChange('text')}
            />
            <FormErrorMessage>{formik.errors.text}</FormErrorMessage>
          </FormControl>
          <Button type='submit' variant='ghost' color='pink.500'>
            Post
          </Button>
        </Flex>
      </form>
      <CustomModal isOpen={loading} onClose={() => {}}>
        <Loading message='Creating A New Comment For You!!🌟' />
      </CustomModal>
    </React.Fragment>
  );
};

export default CommentForm;
