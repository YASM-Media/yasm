import {
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormField from '../form/formField.component';
import * as AuthService from './../../store/auth/service';
import CustomModal from '../../components/modal/modal.component';
import { UpdatePasswordType } from '../../types/updatePassword.type';

export interface UpdatePasswordProps {}

const UpdatePassword: React.FunctionComponent<UpdatePasswordProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialValues: any = {
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
  };

  const validationSchema = yup.object().shape({
    oldPassword: yup.string().min(5).required(),
    newPassword: yup.string().min(5).required(),
    newPasswordAgain: yup.string().min(5).required(),
  });

  const onSubmit = async (values: any) => {
    try {
      if (values.newPassword !== values.newPasswordAgain) {
        throw new Error("Password's don't match.");
      }

      onOpen();

      const passwordData: UpdatePasswordType = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      await AuthService.updatePassword(passwordData);

      onClose();
      toast({
        title: 'Success',
        description: 'All changes have been saved!!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
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
        <Heading color='teal'>Update your password</Heading>

        <form onSubmit={formik.handleSubmit}>
          <FormField
            label='Old Password'
            type='password'
            placeholder='Your Old Password'
            value={formik.values.oldPassword}
            handleChange={formik.handleChange('oldPassword')}
            error={formik.errors.oldPassword}
          />

          <FormField
            label='New Password'
            type='password'
            placeholder='Your New Password'
            value={formik.values.newPassword}
            handleChange={formik.handleChange('newPassword')}
            error={formik.errors.newPassword}
          />

          <FormField
            label='New Password Again'
            type='password'
            placeholder='Your New Password Again'
            value={formik.values.newPasswordAgain}
            handleChange={formik.handleChange('newPasswordAgain')}
            error={formik.errors.newPasswordAgain}
          />

          <Button
            m={5}
            colorScheme='teal'
            type='submit'
            isDisabled={!formik.isValid}
          >
            Update your password!
          </Button>
        </form>
      </Flex>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <Flex align='center' justify='center' direction='column' m={30}>
          <Heading>Updating Your password!</Heading>
        </Flex>
      </CustomModal>
    </React.Fragment>
  );
};

export default UpdatePassword;
