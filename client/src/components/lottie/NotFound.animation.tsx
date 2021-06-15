import { Flex, Text } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface NotFoundProps {
  message: string;
}

const NotFound: React.FunctionComponent<NotFoundProps> = ({ message }) => {
  return (
    <Flex direction='column' align='center' justify='space-evenly'>
      <Player
        autoplay
        loop
        src='https://assets8.lottiefiles.com/temp/lf20_USCruP.json'
        style={{ height: '300px', width: '300px' }}
      />
      <Text fontSize='lg'>{message}</Text>
    </Flex>
  );
};

export default NotFound;
