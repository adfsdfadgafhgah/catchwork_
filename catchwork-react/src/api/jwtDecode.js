import { jwtDecode } from "jwt-decode";

// export const getRoleFromToken = (token) => jwtDecode(token).role;
export const getDecodedToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};
