import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { User } from '../../models/user.model';
import { UpdateProfileType } from '../../types/updateProfile.type';
import ImageUpload from '../utility/ImageUpload.component';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormField from '../form/formField.component';
import * as AuthService from './../../store/auth/service';
import CustomModal from '../../components/modal/modal.component';
import Loading from '../lottie/Loading.animation';

export interface UpdateProfileProps {
  user: User;
}

const UpdateProfile: React.FunctionComponent<UpdateProfileProps> = ({
  user,
}) => {
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const imageUpload = async (
    image: File | Blob | ArrayBuffer | Uint8Array | undefined
  ) => {
    try {
      if (image) {
        onOpen();
        const url = await AuthService.uploadProfileImage(image, user.id);

        setImageUrl(url);

        onClose();
        toast({
          title: 'Success',
          description:
            "Sucessfully uploaded your new image !!🌟. Please don't forget to submit the form to finalize you changes!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      onClose();
      toast({
        title: 'Error Occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const initialValues: any = {
    firstName: user.firstName,
    lastName: user.lastName,
    biography: user.biography,
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    biography: yup.string().required(),
  });

  const onSubmit = async (values: any) => {
    try {
      onOpen();
      const updatedProfile: UpdateProfileType = {
        firstName: values.firstName,
        lastName: values.lastName,
        biography: values.biography,
        imageUrl: imageUrl,
      };

      await AuthService.updateUserProfile(updatedProfile);

      onClose();
      toast({
        title: 'Success',
        description: 'All changes have been saved!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      onClose();
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
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <React.Fragment>
      <Flex mx={25} direction='column'>
        <Heading color='pink.500'>Update your details</Heading>
        <Box mx={25}>
          <ImageUpload
            defaultImage={imageUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            onUpload={imageUpload}
          />
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <FormField
            label='First Name'
            type='text'
            placeholder='Your First Name'
            value={formik.values.firstName}
            handleChange={formik.handleChange('firstName')}
            error={formik.errors.firstName}
          />

          <FormField
            label='Last Name'
            type='text'
            placeholder='Your Last Name'
            value={formik.values.lastName}
            handleChange={formik.handleChange('lastName')}
            error={formik.errors.lastName}
          />

          <FormField
            label='Biography'
            type='text'
            placeholder='Your Biography'
            value={formik.values.biography}
            handleChange={formik.handleChange('biography')}
            error={formik.errors.biography}
          />

          <Button
            m={5}
            variant='outline'
            type='submit'
            isDisabled={!formik.isValid}
          >
            Update your account!
          </Button>
        </form>
      </Flex>
      <CustomModal isOpen={isOpen} onClose={() => {}}>
        <Loading message='Updating Your Profile!!🌟' />
      </CustomModal>
    </React.Fragment>
  );
};

export default UpdateProfile;
