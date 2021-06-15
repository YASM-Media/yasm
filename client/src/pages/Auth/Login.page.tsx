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
import CustomModal from '../../components/modal/modal.component';
import { LoginUser } from '../../types/loginUser.type';
import * as AuthActions from './../../store/auth/actionCreators';
import { useDispatch } from 'react-redux';

export interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = () => {
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialValues: LoginUser = {
    emailAddress: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    emailAddress: yup.string().email().required(),
    password: yup.string().min(5).required(),
  });

  const onSubmit = async (user: LoginUser) => {
    try {
      onOpen();
      await dispatch(AuthActions.login(user));
      onClose();

      toast({
        title: 'Success',
        description: 'Successfully logged you in!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      history.push('/posts');
    } catch (error) {
      onClose();
      console.log(error);
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
        <Flex h='100vh' align='center' justify='center' direction='column'>
          <Heading>Log in to your YASM account!!🌟</Heading>

          <Box mt={30} w={{ base: '40vh', sm: '50vh', md: '70vh', lg: '80vh' }}>
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
            <Button
              m={5}
              colorScheme='teal'
              type='submit'
              isDisabled={!formik.isValid}
            >
              Log in to your account!
            </Button>
          </Box>
          <Link href='/register'>Don't have an account? Register here!</Link>
        </Flex>
      </form>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <Flex align='center' justify='center' direction='column' m={30}>
          <Heading>Logging you in!</Heading>
        </Flex>
      </CustomModal>
    </React.Fragment>
  );
};

export default Login;
