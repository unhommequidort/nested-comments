import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  const [comments, setComments] = useState([]);

  const commentsByParentId = useMemo(() => {
    if (comments == null) return [];
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  const getReplies = (parentId) => {
    return commentsByParentId[parentId];
  };

  function createLocalComment(comment) {
    setComments((prevComments) => [comment, ...prevComments]);
  }

  function updateLocalComment(id, message) {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  }

  function deleteLocalComment(id) {
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment.id !== id);
    });
  }

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        getReplies,
        rootComments: commentsByParentId[null],
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
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
