import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/lottie/Loading.animation';
import { Post as PostModel } from './../../models/post.model';
import * as PostService from './../../store/post/service';
import PostComponent from './../../components/posts/Post.component';
import Navbar from '../../components/nav/Navbar.component';
import useWindowDimensions from '../../hooks/useWindowDimensions.hook';

export interface PostProps {
  id: string;
}

const Post: React.FC<PostProps> = ({ id }) => {
  const [post, setPost] = useState<PostModel>(PostModel.newPost());
  const [loading, setLoading] = useState<boolean>(true);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    PostService.fetchPostById(id)
      .then((postModel) => setPost(postModel))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading message='Loading post for you!!🌟' />;
  }

  return (
    <React.Fragment>
      <Navbar />
      <Flex
        px={{ base: width * 0.05, lg: width * 0.1 }}
        py={{ base: height * 0.05 }}
      >
        <PostComponent post={post} inModal={false} onClose={() => {}} />
      </Flex>
    </React.Fragment>
  );
};

export default Post;
