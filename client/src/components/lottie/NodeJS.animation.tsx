import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface NodeJSProps {}

const NodeJS: React.FunctionComponent<NodeJSProps> = () => {
  return (
    <Flex align='center' justify='center' padding={50}>
      <Player
        autoplay
        loop
        src='https://assets3.lottiefiles.com/packages/lf20_fs5umrrh.json'
        style={{ height: '100px', width: '100px' }}
      />
    </Flex>
  );
};

export default NodeJS;
