import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface SocialProps {}

const Social: React.FunctionComponent<SocialProps> = () => {
  return (
    <Flex align='center' justify='center' boxSize={{ base: 'sm', lg: '2xl' }}>
      <Player
        autoplay
        loop
        src='https://assets2.lottiefiles.com/packages/lf20_6aYlBl.json'
        style={{ height: '100%', width: '100%' }}
      />
    </Flex>
  );
};

export default Social;
