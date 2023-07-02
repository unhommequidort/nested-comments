import Cookies from 'js-cookie';

function useUser() {
  return { id: Cookies.get('userId') };
}

export default useUser;
