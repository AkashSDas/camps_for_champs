import { API } from "../backend";
import { getAuthTokenFromLocalStorage } from "./user";

export const createComment = async (data) => {
  let authtoken = await getAuthTokenFromLocalStorage();
  const formData = new FormData();
  for (const field in data) {
    formData.append(field, data[field]);
  }

  return fetch(`${API}post/comment/`, {
    method: "POST",
    headers: {
      authorization: `token ${authtoken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const deleteComment = async (commentId) => {
  let authToken = await getAuthTokenFromLocalStorage();

  return fetch(`${API}post/comment/${commentId}/`, {
    method: "DELETE",
    headers: {
      authorization: `token ${authToken}`,
    },
  })
    .then((response) => response) // return is not json
    .catch((err) => console.log(err));
};

export const updateComment = async (commentId, data) => {
  let authtoken = await getAuthTokenFromLocalStorage();

  return fetch(`${API}post/comment/${commentId}/`, {
    method: "PUT",
    headers: {
      authorization: `token ${authtoken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
