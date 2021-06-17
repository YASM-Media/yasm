import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormField from '../form/formField.component';
import * as AuthActions from './../../store/auth/actionCreators';
import CustomModal from '../../components/modal/modal.component';
import { useDispatch } from 'react-redux';
import Loading from '../lottie/Loading.animation';

export interface DeleteAccountProps {}

const DeleteAccount: React.FunctionComponent<DeleteAccountProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  const initialValues: any = {
    password: '',
  };

  const validationSchema = yup.object().shape({
    password: yup.string().min(5).required(),
  });

  const onSubmit = async (values: any) => {
    try {
      onOpen();

      await dispatch(AuthActions.deleteAccount(values.password));

      onClose();
      toast({
        title: 'Success',
        description: 'Account has been deleted!!🌟',
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
        <Heading color='pink.500'>Delete Your Account</Heading>
        <Box padding={5}>
          <Text>
            Please note that deleting your account{' '}
            <Text fontWeight='700' display='inline'>
              deletes all of your data from YASM.
            </Text>{' '}
          </Text>

          <p>
            This action is irreversible and no data is recoverable after
            deleting your account.
          </p>
        </Box>

        <form onSubmit={formik.handleSubmit}>
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
            variant='outline'
            type='submit'
            isDisabled={!formik.isValid}
          >
            Delete Your Account!
          </Button>
        </form>
      </Flex>
      <CustomModal isOpen={isOpen} onClose={() => {}}>
        <Loading message='Deleting Your Account!!🌟' />
      </CustomModal>
    </React.Fragment>
  );
};

export default DeleteAccount;
