import { API } from "../backend";

export const getAllPlans = () => {
  return fetch(`${API}camp-plan/`)
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
