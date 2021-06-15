import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AuthState } from '../../store/auth/types';
import * as AuthActions from './../../store/auth/actionCreators';

export interface NavMenuProps {}

const NavMenu: React.FunctionComponent<NavMenuProps> = () => {
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

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
          <MenuItem onClick={() => history.push('/account/profile/me')}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => history.push('/account/update')}>
            Settings
          </MenuItem>
          <MenuItem onClick={async () => await dispatch(AuthActions.logout())}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </React.Fragment>
  );
};

export default NavMenu;
