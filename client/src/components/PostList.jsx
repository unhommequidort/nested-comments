import { useEffect, useState } from 'react';
import { getPosts } from '../services/posts';

export const PostList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);
  return posts.map((post) => (
    <h1 key={post.id}>
      <a href={`/posts/${post.id}`}>{post.title}</a>
    </h1>
  ));
};
