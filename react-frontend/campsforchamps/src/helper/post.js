import { API } from "../backend";
import { getAuthTokenFromLocalStorage, getUserId } from "./user";

export const getAllPosts = () => {
  return fetch(`${API}post/post/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const createPost = async (postData) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in postData) {
    formData.append(field, postData[field]);
  }

  return fetch(`${API}post/post/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const updatePost = async (postId, newPostData) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in newPostData) {
    formData.append(field, newPostData[field]);
  }

  return fetch(`${API}post/post/${postId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const deletePost = async (postId) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  return fetch(`${API}post/post/${postId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${authToken}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getAuthorInfo = (userUrl) => {
  return fetch(`${userUrl}`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const likePost = async (postId) => {
  const authToken = await getAuthTokenFromLocalStorage();
  const userId = await getUserId();

  return fetch(`${API}post/post/${postId}/${userId}/liked/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${authToken}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const dislikePost = async (postId) => {
  const authToken = await getAuthTokenFromLocalStorage();
  const userId = await getUserId();

  return fetch(`${API}post/post/${postId}/${userId}/disliked/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${authToken}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const getPost = (postId) => {
  return fetch(`${API}post/post/${postId}/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
