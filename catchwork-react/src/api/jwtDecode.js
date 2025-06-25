import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = (token) => jwtDecode(token).role;
