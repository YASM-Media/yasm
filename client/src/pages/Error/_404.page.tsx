import { Center } from '@chakra-ui/react';
import NotFound from '../../components/lottie/NotFound.animation';

export interface _404Props {}

const _404: React.FunctionComponent<_404Props> = () => {
  return (
    <Center h='100vh'>
      <NotFound message='This page is not available. Are you sure you are on the right site?' />
    </Center>
  );
};

export default _404;
