import React, { useRef, useState } from 'react';
import { Flex, Button, Image } from '@chakra-ui/react';

export type ImageUploadProps = {
  defaultImage: string;
  onUpload: (image: File | Blob | ArrayBuffer | Uint8Array | undefined) => void;
};

const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({
  defaultImage,
  onUpload,
}) => {
  const [image, setImage] = useState<File | Blob | ArrayBuffer | Uint8Array>();
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const inputFile = useRef<HTMLInputElement>(null);

  const onImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target?.files[0]);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <Flex
      align={{ base: 'center', lg: 'flex-end' }}
      justify={{ base: 'center', lg: 'flex-start' }}
      direction={{ base: 'column', lg: 'row' }}
    >
      <Image
        src={imageUrl ? imageUrl : 'https://via.placeholder.com/150'}
        borderRadius='full'
        boxSize='150px'
      />
      <input
        type='file'
        ref={inputFile}
        onChange={onImageSelect}
        style={{ display: 'none' }}
      ></input>
      <Button m={3} onClick={() => inputFile.current?.click()}>
        Select Image
      </Button>
      <Button
        m={3}
        onClick={async () => {
          try {
            await onUpload(image);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Upload Image
      </Button>
    </Flex>
  );
};

export default ImageUpload;
