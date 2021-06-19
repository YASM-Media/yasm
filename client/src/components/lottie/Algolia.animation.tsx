import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface AlgoliaProps {}

const Algolia: React.FunctionComponent<AlgoliaProps> = () => {
  return (
    <Flex align='center' justify='center' padding={30}>
      <Player
        autoplay
        loop
        src='https://assets4.lottiefiles.com/packages/lf20_1dvph6iw.json'
        style={{ height: '140px', width: '140px' }}
      />
    </Flex>
  );
};

export default Algolia;
