import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface DockerProps {}

const Docker: React.FunctionComponent<DockerProps> = () => {
  return (
    <Flex align='center' justify='center'>
      <Player
        autoplay
        loop
        src='https://assets8.lottiefiles.com/packages/lf20_fi0ty9ak.json'
        style={{ height: '100%', width: '100%' }}
      />
    </Flex>
  );
};

export default Docker;
