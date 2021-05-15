import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import React from 'react';

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement;
}

const CustomModal: React.FunctionComponent<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
