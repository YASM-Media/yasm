import { Flex, Text } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface LoadingProps {
  message: string;
}

const Loading: React.FunctionComponent<LoadingProps> = ({ message }) => {
  return (
    <Flex direction='column' align='center' justify='space-evenly'>
      <Player
        autoplay
        loop
        src='https://assets9.lottiefiles.com/packages/lf20_szlepvdh.json'
        style={{ height: '300px', width: '300px' }}
      />
      <Text fontSize='lg'>{message}</Text>
    </Flex>
  );
};

export default Loading;
