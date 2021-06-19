import { Flex } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';

export interface FirebaseProps {}

const Firebase: React.FunctionComponent<FirebaseProps> = () => {
  return (
    <Flex align='center' justify='center'>
      <Player
        autoplay
        loop
        src='https://api.lottiefiles.com/v2/force-download-file?url=https://assets2.lottiefiles.com/temp_editor_files/lf30_editor_zdkzbypu.json'
        style={{ height: '200px', width: '200px' }}
      />
    </Flex>
  );
};

export default Firebase;
