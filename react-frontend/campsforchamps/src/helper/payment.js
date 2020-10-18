import { API } from "../backend";
import { getAuthTokenFromLocalStorage } from "./user";

// ==========================
// Braintree payment
// ==========================

export const getBraintreeToken = async (userId, token) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  return fetch(`${API}payment/braintree-token/${userId}/${token}/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${authToken}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export const processBraintreePayment = async (userId, token, paymentInfo) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const info in paymentInfo) {
    formData.append(info, paymentInfo[info]);
  }

  return fetch(`${API}payment/braintree-payment/${userId}/${token}/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// ==========================
// Stripe payment
// ==========================
export const processStripePayment = async (userId, token, paymentInfo) => {
  // get user's auth token
  let authToken = await getAuthTokenFromLocalStorage();

  const formData = new FormData();
  for (const info in paymentInfo) {
    formData.append(info, paymentInfo[info]);
  }

  return fetch(`${API}payment/stripe-payment/${userId}/${token}/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
