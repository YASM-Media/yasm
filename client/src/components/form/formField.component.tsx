import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { FormikErrors } from 'formik';

export type FormFieldProps = {
  error?: string | FormikErrors<String>;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  isTextField?: boolean;
};

const FormField: React.FunctionComponent<FormFieldProps> = ({
  error,
  label,
  type,
  placeholder,
  value,
  handleChange,
  isTextField = false,
}) => (
  <Box m={5}>
    <FormControl isRequired isInvalid={error ? true : false}>
      <FormLabel>{label}</FormLabel>
      {!isTextField ? (
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          variant='filled'
        />
      ) : (
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          variant='filled'
        />
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  </Box>
);

export default FormField;
