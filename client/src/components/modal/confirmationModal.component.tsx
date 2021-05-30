import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

export interface ConfirmationModalProps {
  message: string;
  onYes: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Confirmation Modal.
 * @param message <essage to display for confirmation
 * @param onYes If Pressed Yes
 * @param isOpen Modal Visibilty
 * @param onClose Close Modal.
 */
const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> = ({
  message,
  onYes,
  isOpen,
  onClose,
}) => {
  return (
    <React.Fragment>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{message}</ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onYes}>
              Yes
            </Button>
            <Button variant='ghost' onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmationModal;
