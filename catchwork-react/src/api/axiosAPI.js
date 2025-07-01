import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
// const axiosApi = axios.create({
//   baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
//   withCredentials: true,
// });
export const axiosApi = axios.create({
  baseURL: baseUrl,
  // baseURL: "http://localhost:8080",
  //   baseURL: "https://cmh-boardproject.store", // 추후 aws 서버 주소로 변경경

  withCredentials: true,
  // headers : {"Content-Type" : "application/json"}
  // headers: {
  //   Authorization: `Bearer ${accessToken}`,
  // },
});
