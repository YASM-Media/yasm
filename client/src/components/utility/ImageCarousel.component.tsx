import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Image as ImageModel } from '../../models/image.model';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

export type ImageCarouselProps = {
  images: ImageModel[];
};

/**
 * Component to display images in a carousel mode.
 * @param images Images array
 */
const ImageCarousel: React.FunctionComponent<ImageCarouselProps> = ({
  images,
}) => {
  // State to keep track of the image index.
  const [index, setIndex] = useState<number>(0);

  /**
   * Function to go to previous image.
   */
  const onPreviousImage = () => {
    if (index === 0) {
      return;
    } else {
      setIndex(index - 1);
    }
  };

  /**
   * Function to go to the next image.
   */
  const onNextImage = () => {
    if (index === images.length - 1) {
      return;
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <React.Fragment>
      <Box position='relative' textAlign='center'>
        <Image
          objectFit='cover'
          width='100%'
          height='100%'
          src={images[index].imageUrl}
        />
        <Flex
          align='center'
          justify='space-between'
          position='absolute'
          top='0%'
          w='100%'
          h='100%'
          p={1}
        >
          {images.length > 1 && (
            <React.Fragment>
              {' '}
              <IconButton
                aria-label='Previous Image'
                icon={<MdKeyboardArrowLeft color='white' />}
                borderRadius='full'
                bgColor='black'
                opacity='50%'
                size='sm'
                onClick={onPreviousImage}
              />
              <IconButton
                aria-label='Next Image'
                icon={<MdKeyboardArrowRight color='white' />}
                borderRadius='full'
                bgColor='black'
                opacity='50%'
                size='sm'
                onClick={onNextImage}
              />
            </React.Fragment>
          )}
        </Flex>
      </Box>
    </React.Fragment>
  );
};

export default ImageCarousel;
