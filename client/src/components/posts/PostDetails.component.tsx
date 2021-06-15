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
  Box,
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
      <Flex
        direction='row'
        justify='space-between'
        borderBottomColor='blackAlpha.200'
        borderBottomWidth={1.5}
        h='fit-content'
        padding={5}
      >
        <Flex direction='row'>
          <Box marginRight={5}>
            <Link href={`/account/profile/${post.user.id}`} w='100%'>
              <Avatar
                name={`${post.user.firstName} ${post.user.lastName}`}
                src={post.user.imageUrl}
                size='md'
              />
            </Link>
          </Box>
          <Flex direction='column'>
            <Link href={`/account/profile/${post.user.id}`}>
              <Text
                fontSize='lg'
                fontWeight='semibold'
              >{`${post.user.firstName} ${post.user.lastName}`}</Text>
            </Link>
            <Box wordBreak='break-word' overflowWrap='break-word' maxW='xs'>
              <Text>{post.text}</Text>
            </Box>
          </Flex>
        </Flex>
        <Box>
          {post.user.id === auth.loggedInUser.id && (
            <Menu>
              <MenuButton
                variant='ghost'
                as={IconButton}
                icon={<BsThreeDotsVertical />}
              />
              <MenuList>
                <MenuItem
                  onClick={() => history.push(`/posts/update/${post.id}`)}
                >
                  Update Post
                </MenuItem>
                <MenuItem onClick={onDelete}>Delete Post</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default PostDetails;
