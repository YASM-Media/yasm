import { Flex, Text } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface NoDataProps {
  message: string;
}

const NoData: React.FunctionComponent<NoDataProps> = ({ message }) => {
  return (
    <Flex direction='column' align='center' justify='space-evenly'>
      <Player
        autoplay
        loop
        src='https://assets1.lottiefiles.com/packages/lf20_qpi4erm0.json'
        style={{ height: '300px', width: '300px' }}
      />
      <Text fontSize='lg'>{message}</Text>
    </Flex>
  );
};

export default NoData;
