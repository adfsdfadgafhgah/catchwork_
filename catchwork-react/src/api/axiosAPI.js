import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { getDecodedToken } from "./jwtDecode";

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

/************************************************************/

// 요청 인터셉터 모든 요청을 가로채서 local의 accessToken을 header에 넣어서 보냄
axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
axiosApi.interceptors.response.use(
  // 성공 시 응답 그대로 반환
  (res) => res,

  // 실패 응답 처리
  async (error) => {
    // 재요청할 때 필요한 기존 요청 정보
    const originalRequest = error.config;
    // console.log("originalRequest", originalRequest);

    // 재발급 실패
    if (originalRequest.url === "/reissue") {
      console.log("refresh failed");
      // localStorage 초기화
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("accessToken");
      localStorage.clear();

      // zustand 등 store도 초기화
      useAuthStore.getState().signOut();
      // 로그인 강제 이동
      window.location.href = "/signin";
      return Promise.reject(error);
    }

    // 401 오류인 경우 최초 1회 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 재발급 요청 axiosAPI는 요청 인터셉터가 가로채 헤더에 token 삽입 > 기본 axios 사용
        const res = await axios.post(
          `${baseUrl}reissue`,
          {},
          { withCredentials: true }
        );
        const newToken = res.headers.authorization?.split(" ")[1];
        if (newToken) {
          const decoded = getDecodedToken(newToken);
          // debug
          // console.log("token refreshed", decoded);

          // 상태 수동 갱신
          localStorage.setItem("accessToken", newToken);
          useAuthStore.setState({
            memNo: decoded.memNo,
            memNickname: decoded.memNickname,
            memType: decoded.memType,
          });

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // 원래 요청 재시도
          return axiosApi(originalRequest);
        }
      } catch (refreshError) {
        // localStorage 초기화
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("accessToken");
        // useAuthStore.getState().signOut();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
