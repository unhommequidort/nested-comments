import { createContext, useContext } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../services/posts';
import { useParams } from 'react-router-dom';

const Context = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePost = () => {
  return useContext(Context);
};

// eslint-disable-next-line react/prop-types
export const PostProvider = ({ children }) => {
  const { id } = useParams();
  const { loading, error, value: post } = useAsync(() => getPost(id), [id]);

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
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
