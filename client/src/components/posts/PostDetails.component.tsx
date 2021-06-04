import {
  Avatar,
  IconButton,
  Flex,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Post } from '../../models/post.model';
import { AuthState } from '../../store/auth/types';

export interface PostDetailsProps {
  post: Post;
  onDelete: () => void;
}

const PostDetails: React.FunctionComponent<PostDetailsProps> = ({
  post,
  onDelete,
}) => {
  // Reading the auth state for logged in user details.
  const auth: AuthState = useSelector((state: RootStateOrAny) => state.auth);

  // History Hook.
  const history = useHistory();

  return (
    <React.Fragment>
      <Link href={`/account/profile/${post.user.id}`} w='100%'>
        <Flex direction='row' align='center'>
          <Avatar
            marginRight={5}
            name={`${post.user.firstName} ${post.user.lastName}`}
            src={post.user.imageUrl}
            size='md'
          />
          <Text fontSize='sm'>{`${post.user.firstName} ${post.user.lastName}`}</Text>
        </Flex>
      </Link>
      {post.user.id === auth.loggedInUser.id && (
        <Menu>
          <MenuButton
            bgColor='transparent'
            as={IconButton}
            icon={<BsThreeDotsVertical />}
          />
          <MenuList>
            <MenuItem onClick={() => history.push(`/posts/update/${post.id}`)}>
              Update Post
            </MenuItem>
            <MenuItem onClick={onDelete}>Delete Post</MenuItem>
          </MenuList>
        </Menu>
      )}
    </React.Fragment>
  );
};

export default PostDetails;
