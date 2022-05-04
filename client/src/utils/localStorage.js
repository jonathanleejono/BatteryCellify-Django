export const addUserToLocalStorage = ({ user, token, location }) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  localStorage.setItem("location", location);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("location");
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem("user");
  const user = result ? JSON.parse(result) : null;
  return user;
};

export const getTokenFromLocalStorage = () => {
  const result = localStorage.getItem("token");
  if (result === !null || undefined || "undefined" || false) {
    const token = result;
    return token;
  } else {
    const token = null;
    return token;
  }
};
