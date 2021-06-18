import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface SocialProps {}

const Social: React.FunctionComponent<SocialProps> = () => {
  return (
    <Flex align='center' justify='center' boxSize={{ base: 'sm', lg: 'xl' }}>
      <Player
        autoplay
        loop
        src='https://assets9.lottiefiles.com/private_files/lf30_sle66urp.json'
        style={{ height: '100%', width: '100%' }}
      />
    </Flex>
  );
};

export default Social;
