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
import * as AuthService from './../../store/auth/service';
import Loading from '../../components/lottie/Loading.animation';

export interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = () => {
  const toast = useToast();
  const history = useHistory();
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
      await AuthService.login(user);
      onClose();

      toast({
        title: 'Success',
        description: 'Successfully logged you in!🌟',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      history.push('/posts');
    } catch (error: any) {
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
        <Flex minH='100vh' align='center' justify='center' direction='column'>
          <Heading textAlign='center'>Log in to your YASM account!!🌟</Heading>

          <Box mt={30} w={{ base: '100%', sm: '70%', md: '60%', lg: '40%' }}>
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
            <Button m={5} type='submit' isDisabled={!formik.isValid}>
              Log in to your account!
            </Button>
          </Box>
          <Link href='/register'>Don't have an account? Register here!</Link>
        </Flex>
      </form>
      <CustomModal isOpen={isOpen} onClose={() => {}}>
        <Loading message='Logging You In!!🌟' />
      </CustomModal>
    </React.Fragment>
  );
};

export default Login;
