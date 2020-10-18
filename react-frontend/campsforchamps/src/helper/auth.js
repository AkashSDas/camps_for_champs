// save session token received from backend
export const saveAuthToken = (data, next) => {
  if (typeof window !== undefined) {
    localStorage.setItem("jwt", JSON.stringify(data));

    // what to do next after saving
    next();
  }
};

// to check if user if authenticated
export const isAuthenticated = () => {
  if (typeof window === undefined) {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    // TODO: call the server for this user's session_token
    // and then compare them
    return JSON.parse(localStorage.getItem("jwt"));
  }
  return false;
};
