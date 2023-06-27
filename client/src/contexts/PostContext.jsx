import { createContext, useContext, useMemo } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../services/posts';
import { useParams } from 'react-router-dom';

const Context = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePost = () => {
  return useContext(Context);
};

// eslint-disable-next-line react/prop-types
const PostProvider = ({ children }) => {
  const { id } = useParams();
  const { loading, error, value: post } = useAsync(() => getPost(id), [id]);

  const commentsByParentId = useMemo(() => {
    if (post?.comments == null) return [];
    const group = {};
    post.comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [post?.comments]);

  const getReplies = (parentId) => {
    return commentsByParentId[parentId];
  };

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        getReplies,
        rootComments: commentsByParentId[null],
      }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <h1 className="error-msg">Error! {error} </h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default PostProvider;
