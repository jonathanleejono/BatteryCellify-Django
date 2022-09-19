export const addUserToLocalStorage = () => {
  localStorage.setItem('user', true);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user');
  return result;
};
