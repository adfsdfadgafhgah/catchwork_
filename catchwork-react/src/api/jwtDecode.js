import { jwtDecode } from "jwt-decode";

export const getDecodedToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
