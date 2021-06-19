import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface ReactProps {}

const React: React.FunctionComponent<ReactProps> = () => {
  return (
    <Flex align='center' justify='center' padding={50}>
      <Player
        autoplay
        loop
        src='https://assets6.lottiefiles.com/packages/lf20_yMrzAd.json'
        style={{ height: '100px', width: '100px' }}
      />
    </Flex>
  );
};

export default React;
