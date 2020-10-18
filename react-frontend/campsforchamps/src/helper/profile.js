import { API } from "../backend";
import { getAuthTokenFromLocalStorage } from "./user";

export const getUserProfile = (userId) => {
  return fetch(`${API}profile/${userId}/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const updateUserProfile = async (userId, data) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in data) {
    if (field !== "image") {
      formData.append(field, data[field]);
    }
  }

  return fetch(`${API}profile/${userId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${authToken}`,
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
