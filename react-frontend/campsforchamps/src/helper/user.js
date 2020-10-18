import { API } from "../backend";
import { isAuthenticated } from "./auth";

export const signup = (user) => {
  // instead of configuration FormData() can be used here
  return fetch(`${API}user/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .catch((err) => console.log(`Sign Up error: ${err}`));
  // TODO: handle these error
};

// get user authorization token
// username: email
export const getAuthToken = (email, password) => {
  return fetch(`${API}user/api-token-auth/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password: password }),
  })
    .then((response) => response.json())
    .catch((err) => console.log(`Sign Up error: ${err}`));
  // TODO: handle these error
};

export const login = (user) => {
  const formData = new FormData();

  // adding user's fields to formData
  for (const name in user) {
    formData.append(name, user[name]);
  }

  // What's going on with formData
  // const { email, password } = user; // Destructuring
  // const formData = new FormData(); // creating new FormData instance
  // formData.append("email", email);
  // formData.append("password", password);

  // Keys
  // for (var key in formData.keys()) {
  //   console.log(`FORM KEYS: ${key}`);
  // }

  return fetch(`${API}user/login/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Successfully logged in");
      return response.json();
    })
    .then((data) => {
      if (!data) {
        return data;
      }

      return getAuthToken(user.email, user.password)
        .then((response) => {
          let authToken = response.token;
          if (authToken) {
            data = {
              ...data,
              authToken: authToken,
            };
            return data;
          } else {
            console.log("Error in getting token ");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(`Login error: ${err}`));
};

export const logout = (next) => {
  const userId = isAuthenticated() && isAuthenticated().user.id;

  if (isAuthenticated()) {
    if (typeof window !== undefined) {
      localStorage.removeItem("jwt");

      // TODO: empty user's cart here

      return fetch(`${API}user/${userId}/logout/`, {
        method: "GET",
      })
        .then((response) => {
          console.log("Logout successfully");
          next();
        })
        .catch((err) => console.log(err));
    }
  }
};

export const passwordReset = (passwordResetData) => {
  const formData = new FormData();

  for (const field in passwordResetData) {
    formData.append(field, passwordResetData[field]);
  }

  return fetch(`${API}user/password_reset/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log("Password reset email is sent");
      return response.json();
    })
    .catch((err) => console.log(`Login error: ${err}`));
};

export const passwordResetConfirm = (passwordResetConfirmData) => {
  const formData = new FormData();
  for (const field in passwordResetConfirmData) {
    formData.append(field, passwordResetConfirmData[field]);
  }

  return fetch(`${API}user/password_reset/confirm/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log("Password reset confirm: ", err));
};

// getting the user id from localStrorage
export const getUserId = () => {
  return isAuthenticated() && isAuthenticated().user.id;
};

// get individual user detail
export const getUserInfo = (userId) => {
  return fetch(`${API}user/${userId}/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// get user auth token from localStorage
export const getAuthTokenFromLocalStorage = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("jwt")) {
      return JSON.parse(localStorage.getItem("jwt")).authToken;
    }
  }
  return null;
};

// update user core info (username, email)
export const updateUserCoreInfo = async (data) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  // get user id
  let userId = await getUserId();

  const formData = new FormData();
  for (const field in data) {
    formData.append(field, data[field]);
  }

  return fetch(`${API}user/${userId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
  // TODO: show error./success popups
};

// change password
export const changeUserPassword = async (data) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in data) {
    formData.append(field, data[field]);
  }

  return fetch(`${API}user/change-password/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json)
    .catch((err) => console.log(err));
};
