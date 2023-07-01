function useUser() {
  return { id: document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id };
}

export default useUser;
