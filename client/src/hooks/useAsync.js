import { useCallback, useEffect, useState } from 'react';

export const useAsync = (func, dependencies = []) => {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
};

export const useAsyncFn = (func, dependencies = []) => {
  return useAsyncInternal(func, dependencies, false);
};

const useAsyncInternal = (func, dependencies, initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        setValue(data);
        setError(undefined);
        return data;
      })
      .catch((error) => {
        setValue(undefined);
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { loading, error, value, execute };
};
