import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Image } from '../../models/image.model';
import { useFormik } from 'formik';
import * as PostsService from './../../store/post/service';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import ImageModal from '../../components/utility/ImageModal.component';
import FormField from '../../components/form/formField.component';
import { UpdatePostType } from '../../types/posts/updatePost.type';
import { CreatePostType } from '../../types/posts/createPost.type';
import CustomModal from '../../components/modal/modal.component';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router';

export interface PostFormProps {
  isEdit: boolean;
  postId?: string;
}

type FormAttributes = {
  text: string;
};

/**
 * Post creation and updating form.
 * @param isEdit Edit boolean
 * @param postId Post ID
 */
const PostForm: React.FunctionComponent<PostFormProps> = ({
  isEdit = false,
  postId = '',
}) => {
  // Loading State.
  const [loading, setLoading] = useState(false);

  // Image Array State.
  const [images, setImages] = useState<Image[]>([]);

  // Text State
  const [text, setText] = useState<string>('');

  // Toast Hook
  const toast = useToast();

  // If in editing mode, fetch the post details.
  useEffect(() => {
    if (isEdit)
      PostsService.fetchPostById(postId).then((post) => {
        setText(post.text);
        setImages(post.images);
      });
  }, [postId, isEdit]);

  // Validation Schema for the form.
  const validationSchema = yup.object().shape({
    text: yup.string().required().min(10),
  });

  /**
   * Form Submission Handler.
   * @param values Form Values
   */
  const onSubmit = async (values: FormAttributes): Promise<void> => {
    // Set loading state as true.
    setLoading(true);
    try {
      if (isEdit) {
        // Setup update object and send data to server.
        const updatePost: UpdatePostType = {
          id: postId,
          text: values.text,
          images: images,
        };

        await PostsService.updatePost(updatePost);
      } else {
        // Setup create object and send data to server.
        const createPost: CreatePostType = {
          text: values.text,
          images: images,
        };

        await PostsService.createPost(createPost);
      }

      // Set loading state as false
      setLoading(false);

      // Toast the user success.
      toast({
        title: 'Success',
        description: !isEdit
          ? 'Successfully created a new post!!🌟'
          : 'Successfully updated your post!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
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

  // Formik Hook.
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      text: text,
    },
    validationSchema,
    onSubmit,
  });

  // Disclosure Hook
  const { isOpen, onOpen, onClose } = useDisclosure();

  // History Hook
  const history = useHistory();

  /**
   * Remove image from state
   */
  const removeImage = (imageUrl: string) =>
    setImages(images.filter((image) => image.imageUrl !== imageUrl));

  /**
   * Add Image to the images array
   */
  const addImage = (imageUrl: string) =>
    setImages([...images, new Image('', imageUrl)]);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Flex
          h='100vh'
          w={{ base: '100%', sm: '70%', lg: '40%' }}
          direction='column'
          p={30}
        >
          <Flex direction='row' align='center'>
            <IconButton
              onClick={() => history.goBack()}
              bgColor='transparent'
              aria-label='back'
              icon={<MdArrowBack />}
            />
            <Heading>
              {isEdit ? 'Update Your Post!!🌟' : 'Create New Post!!🌟'}
            </Heading>
          </Flex>
          <FormField
            label='Post'
            type='textarea'
            isTextField={true}
            placeholder='Your Post'
            value={formik.values.text}
            handleChange={formik.handleChange('text')}
            error={formik.errors.text}
          />
          <Button m={5} type='submit' isDisabled={!formik.isValid}>
            {isEdit ? 'Update Your Post!' : 'Create New Post!'}
          </Button>
          <Button variant='ghost' onClick={onOpen}>
            Choose Images
          </Button>
        </Flex>
      </form>
      <ImageModal
        visible={isOpen}
        onClose={onClose}
        images={images}
        onDelete={removeImage}
        onAddImage={addImage}
      />
      <CustomModal isOpen={loading} onClose={() => {}}>
        <Flex align='center' justify='center' direction='column' m={30}>
          <Heading>
            {isEdit ? 'Updating Your Post!' : 'Creating A New Post!'}
          </Heading>
        </Flex>
      </CustomModal>
    </React.Fragment>
  );
};

export default PostForm;
