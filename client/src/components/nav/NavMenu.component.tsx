import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AuthState } from '../../store/auth/types';
import * as AuthActions from './../../store/auth/actionCreators';

export interface NavMenuProps {}

const NavMenu: React.FunctionComponent<NavMenuProps> = () => {
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <Flex direction='column'>
        <Avatar
          name={`${auth.loggedInUser.firstName} ${auth.loggedInUser.lastName}`}
          src={auth.loggedInUser.imageUrl}
          cursor='pointer'
          size='sm'
          onClick={() => menuRef.current?.click()}
        />
        <Menu>
          <MenuButton w={0} h={0} ref={menuRef} />
          <MenuList>
            <MenuItem onClick={() => history.push('/account/profile/me')}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => history.push('/account/update')}>
              Settings
            </MenuItem>
            <MenuItem
              onClick={async () => await dispatch(AuthActions.logout())}
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </React.Fragment>
  );
};

export default NavMenu;
