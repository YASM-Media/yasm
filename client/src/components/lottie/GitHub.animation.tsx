import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface GitHubProps {}

const GitHub: React.FunctionComponent<GitHubProps> = () => {
  return (
    <Flex align='center' justify='center'>
      <Player
        autoplay
        loop
        src='https://assets7.lottiefiles.com/packages/lf20_S6vWEd.json'
        style={{ height: '100%', width: '100%' }}
      />
    </Flex>
  );
};

export default GitHub;
