import { API } from "../backend";

export const getAllProducts = () => {
  return fetch(`${API}camp-product/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

