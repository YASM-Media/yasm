import { Flex } from '@chakra-ui/react';
import React from 'react';
import Branding from './Branding.component';
import NavMenu from './NavMenu.component';
import Searchbar from './Searchbar.component';

export interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = () => {
  return (
    <React.Fragment>
      <Flex
        align='center'
        justify='space-evenly'
        padding={5}
        marginBottom={10}
        marginX={{ base: 1, lg: 10 }}
        position='sticky'
        top={2}
        zIndex={99}
        backgroundColor='white'
        boxShadow='0 4px 8px 0 rgba(0,0,0,0.5)'
        borderRadius='lg'
      >
        <Branding />
        <Searchbar />
        <NavMenu />
      </Flex>
    </React.Fragment>
  );
};

export default Navbar;
