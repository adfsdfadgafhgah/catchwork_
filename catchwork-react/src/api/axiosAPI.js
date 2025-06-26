import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://localhost:8080",
  //   baseURL: "https://cmh-boardproject.store", // 추후 aws 서버 주소로 변경경

  withCredentials: true,
  // headers : {"Content-Type" : "application/json"}
  // headers: {
  //   Authorization: `Bearer ${accessToken}`,
  // },
});
