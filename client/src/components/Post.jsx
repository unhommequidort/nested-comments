import { usePost } from '../contexts/PostContext';

const Post = () => {
  const { post } = usePost();
  return (
    <>
      <h1>{post.title}</h1>
      <article>{post.body}</article>
    </>
  );
};

export default Post;
