import { API } from "../backend";
import { getAuthTokenFromLocalStorage } from "./user";

export const createCampPlanOrder = async (userId, token, orderData) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in orderData) {
    formData.append(field, orderData[field]);
  }

  return fetch(`${API}order-camp-plan/add/${userId}/${token}/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const createCampProductOrder = async (userId, token, orderData) => {
  // get user's auth token
  // let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const field in orderData) {
    formData.append(field, orderData[field]);
  }

  return fetch(`${API}order-camp-product/add/${userId}/${token}/`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
