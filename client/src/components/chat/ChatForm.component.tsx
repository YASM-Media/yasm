import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import * as chatService from './../../store/chat/service';
import useWindowDimensions from '../../hooks/useWindowDimensions.hook';
import { CreateMessageDto } from '../../dto/chat/create-message.dto';

export interface ChatFormProps {
  threadId: string;
}

const ChatForm: React.FC<ChatFormProps> = ({ threadId }) => {
  const { height } = useWindowDimensions();

  const validationSchema = yup.object().shape({
    text: yup.string().required(),
  });

  const onSubmit = async (values: { text: string }): Promise<void> => {
    await chatService.createNewMessage(
      CreateMessageDto.newCreateMessageDto(values.text, threadId)
    );
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      text: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex h={height * 0.02} direction='row' marginY={height * 0.04}>
        <FormControl isRequired isInvalid={formik.errors.text ? true : false}>
          <Input
            type='text'
            placeholder='Message...'
            value={formik.values.text}
            onChange={formik.handleChange('text')}
          />
          <FormErrorMessage>{formik.errors.text}</FormErrorMessage>
        </FormControl>
        <Button type='submit' variant='ghost' color='pink.500'>
          Send
        </Button>
      </Flex>
    </form>
  );
};

export default ChatForm;
