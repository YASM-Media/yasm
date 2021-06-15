import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { AuthState } from '../../store/auth/types';

export interface NavMenuProps {}

const NavMenu: React.FunctionComponent<NavMenuProps> = () => {
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  return (
    <React.Fragment>
      <Menu>
        <MenuButton
          as={Avatar}
          name={`${auth.loggedInUser.firstName} ${auth.loggedInUser.lastName}`}
          src={auth.loggedInUser.imageUrl}
          cursor='pointer'
          size='sm'
        />
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Log Out</MenuItem>
        </MenuList>
      </Menu>
    </React.Fragment>
  );
};

export default NavMenu;
