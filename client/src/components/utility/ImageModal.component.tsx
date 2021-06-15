import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { Image as ImageModel } from '../../models/image.model';
import NoData from '../lottie/NoData.animation';
import ImageDisplay from './ImageDisplay.component';

export interface ImageModalProps {
  images: ImageModel[];
  visible: boolean;
  onClose: () => void;
  onDelete: (imageUrl: string) => void;
  onAddImage: (imageUrl: string) => void;
}

/**
 * Image modal to delete and add new images.
 * @param images Images array
 * @param visible Modal Visibility
 * @param onClose Modal Close function
 * @param onDelete Delete image from array
 * @param onAddImage Add image to images array
 */
const ImageModal: React.FunctionComponent<ImageModalProps> = ({
  images,
  visible,
  onClose,
  onDelete,
  onAddImage,
}) => {
  // File input ref.
  const inputFile = useRef<HTMLInputElement>(null);

  // Save image to images array state.
  const onImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onAddImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Upload Your Images Here!!🌟</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {images.length > 0 &&
              images.map((image) => (
                <ImageDisplay
                  onDelete={onDelete}
                  key={image.imageUrl}
                  image={image}
                />
              ))}
            {images.length === 0 && <NoData message='No Posts To Show!!🌟' />}
          </ModalBody>

          <ModalFooter>
            <Flex align='center' justify='space-evenly'>
              <Button
                variant='ghost'
                onClick={() => inputFile.current?.click()}
              >
                Upload Image
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Close
              </Button>
            </Flex>
            <input
              type='file'
              ref={inputFile}
              onChange={onImageSelect}
              style={{ display: 'none' }}
            />
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ImageModal;
