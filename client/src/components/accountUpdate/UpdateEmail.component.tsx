import {
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { User } from '../../models/user.model';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormField from '../form/formField.component';
import * as AuthService from './../../store/auth/service';
import CustomModal from '../../components/modal/modal.component';
import { UpdateEmailType } from '../../types/updateEmail.type';

export interface UpdateEmailProps {
  user: User;
}

const UpdateEmail: React.FunctionComponent<UpdateEmailProps> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialValues: UpdateEmailType = {
    emailAddress: user.emailAddress,
    password: '',
  };

  const validationSchema = yup.object().shape({
    emailAddress: yup.string().email().required(),
    password: yup.string().min(5).required(),
  });

  const onSubmit = async (values: UpdateEmailType) => {
    try {
      onOpen();

      await AuthService.updateEmailAddress(values);

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
        <Heading color='teal'>Update your email address</Heading>

        <form onSubmit={formik.handleSubmit}>
          <FormField
            label='Email Address'
            type='email'
            placeholder='Your Email Address'
            value={formik.values.emailAddress}
            handleChange={formik.handleChange('emailAddress')}
            error={formik.errors.emailAddress}
          />

          <FormField
            label='Password'
            type='password'
            placeholder='Your Password'
            value={formik.values.password}
            handleChange={formik.handleChange('password')}
            error={formik.errors.password}
          />

          <Button
            m={5}
            colorScheme='teal'
            type='submit'
            isDisabled={!formik.isValid}
          >
            Update your email address!
          </Button>
        </form>
      </Flex>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <Flex align='center' justify='center' direction='column' m={30}>
          <Heading>Updating Your Email Address!</Heading>
        </Flex>
      </CustomModal>
    </React.Fragment>
  );
};

export default UpdateEmail;
