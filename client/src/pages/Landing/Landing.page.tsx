import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import Algolia from '../../components/lottie/Algolia.animation';
import Firebase from '../../components/lottie/Firebase.animation';
import NodeJS from '../../components/lottie/NodeJS.animation';
import React from '../../components/lottie/React.animation';
import Social from '../../components/lottie/Social.animation';
import Branding from '../../components/nav/Branding.component';

export interface LandingProps {}

const Landing: React.FunctionComponent<LandingProps> = () => {
  return (
    <Flex direction='column' justify='center' align='center'>
      <Flex
        align='center'
        justify='space-between'
        w='100%'
        paddingX={50}
        paddingY={25}
      >
        <Branding color='pink' />
        <Box>
          <Link href='/login'>
            <Button variant='ghost'>Log In</Button>
          </Link>
          <Link href='/register'>
            <Button variant='ghost'>Sign Up</Button>
          </Link>
        </Box>
      </Flex>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align='center'
        justify={{ base: 'center', lg: 'space-between' }}
        paddingRight={{ base: 0, lg: 100 }}
      >
        <Social />
        <Flex
          maxW={{ base: '100%', lg: '35%' }}
          direction='column'
          justify={{ base: 'center' }}
          align={{ base: 'center', lg: 'flex-end' }}
          textAlign={{ base: 'center', lg: 'right' }}
          padding={{ base: 5, lg: 0 }}
        >
          <Text
            fontSize={{ base: '4xl', lg: '7xl' }}
            fontWeight='extrabold'
            color='pink.500'
          >
            YASM Media
          </Text>
          <Text fontSize={{ base: 'xl', lg: '4xl' }} fontWeight='extrabold'>
            The new coolest and hippest place on the internet!
          </Text>
        </Flex>
      </Flex>

      <Flex
        direction='column'
        justify='center'
        align='center'
        padding={{ base: 5, lg: 0 }}
      >
        <Text
          fontSize={{ base: '3xl', lg: '4xl' }}
          fontWeight='extrabold'
          color='pink.500'
          textAlign='center'
        >
          We are completely open source!{' '}
          <Link href='https://github.com/khatrivarun/yasm'>Find us here!</Link>
        </Text>
        <Text
          fontSize={{ base: '3xl', lg: '4xl' }}
          fontWeight='extrabold'
          color='pink.500'
          textAlign='center'
        >
          Built Using,
        </Text>
        <Wrap justify='center'>
          <WrapItem>
            <Flex direction='column' justify='center' align='center'>
              <React />
              <Link>React</Link>
            </Flex>
          </WrapItem>
          <WrapItem>
            <Flex direction='column' justify='center' align='center'>
              <NodeJS />
              <Link>NodeJS</Link>
            </Flex>
          </WrapItem>
          <WrapItem>
            <Flex direction='column' justify='center' align='center'>
              <Firebase />
              <Link>Firebase</Link>
            </Flex>
          </WrapItem>
          <WrapItem>
            <Flex direction='column' justify='center' align='center'>
              <Algolia />
              <Link>Algolia</Link>
            </Flex>
          </WrapItem>
        </Wrap>
      </Flex>
    </Flex>
  );
};

export default Landing;
