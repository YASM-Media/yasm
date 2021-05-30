import { Button, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { Image as ImageModel } from '../../models/image.model';

export interface ImageDisplayProps {
  image: ImageModel;
  onDelete: (imageUrl: string) => void;
}

/**
 * Display Images with option to delete image.
 * @param image Image object
 * @param onDelete Delete image from images array.
 */
const ImageDisplay: React.FunctionComponent<ImageDisplayProps> = ({
  image,
  onDelete,
}) => {
  return (
    <React.Fragment>
      <Flex direction='column' justify='center' align='center' marginY={5}>
        <Image src={image.imageUrl} />
        <Button variant='ghost' onClick={() => onDelete(image.imageUrl)}>
          Delete Image
        </Button>
      </Flex>
    </React.Fragment>
  );
};

export default ImageDisplay;
