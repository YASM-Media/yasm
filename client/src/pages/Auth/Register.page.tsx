import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormField from '../../components/form/formField.component';
import { RegisterUser } from '../../types/registerUser.type';
import CustomModal from '../../components/modal/modal.component';
import * as AuthService from './../../store/auth/service';
import { UserType } from '../../types/user.type';

export interface RegisterProps {}

const Register: React.FunctionComponent<RegisterProps> = () => {
  const toast = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialValues: RegisterUser = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    passwordAgain: '',
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    emailAddress: yup.string().email().required(),
    password: yup.string().min(5).required(),
    passwordAgain: yup.string().min(5).required(),
  });

  const onSubmit = async (values: RegisterUser) => {
    try {
      const user: UserType = {
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        password: values.password.toString(),
      };
      onOpen();
      await AuthService.register(user);
      onClose();

      toast({
        title: 'Success',
        description: 'Sucessfully created a new account!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      history.push('/login');
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
    onSubmit: onSubmit,
    validationSchema: validationSchema,
  });

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Flex minH='100vh' align='center' justify='center' direction='column'>
          <Heading textAlign='center'>
            Register yourself an account in YASM!!🌟
          </Heading>

          <Box mt={30} w={{ base: '100%', sm: '70%', md: '60%', lg: '40%' }}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify='space-between'
            >
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
            </Flex>

            <FormField
              label='Email Address'
              type='text'
              placeholder='Your Email Address'
              value={formik.values.emailAddress}
              handleChange={formik.handleChange('emailAddress')}
              error={formik.errors.emailAddress}
            />

            <FormField
              label='Password'
              type='password'
              placeholder='Your Password'
              value={formik.values.password.toString()}
              handleChange={formik.handleChange('password')}
              error={formik.errors.password}
            />

            <FormField
              label='Password Again'
              type='password'
              placeholder='Your Password Again'
              value={formik.values.passwordAgain}
              handleChange={formik.handleChange('passwordAgain')}
              error={formik.errors.passwordAgain}
            />
            <Button m={5} type='submit' isDisabled={!formik.isValid}>
              Create an account!
            </Button>
          </Box>
          <Link href='/login'>Already have an account? Login here!</Link>
        </Flex>
      </form>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <Flex align='center' justify='center' direction='column' m={30}>
          <Heading>Creating a new account for you!</Heading>
        </Flex>
      </CustomModal>
    </React.Fragment>
  );
};

export default Register;
