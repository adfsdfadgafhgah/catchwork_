import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosApi } from "../api/axiosAPI";
import { getDecodedToken } from "../api/jwtDecode";

export const useAuthStore = create(
  persist(
    (set) => ({
      memNo: null,
      memType: null,
      role: null,

      signin: async (memId, memPw) => {
        try {
          const res = await axiosApi.post("/signin", { memId, memPw });
          const token = res.headers.authorization?.split(" ")[1];
          if (token) {
            localStorage.setItem("accessToken", token);
            const decoded = getDecodedToken(token);
            set({ memNo: decoded.memNo, memType: decoded.memType, role: decoded.role });
            return { success: true, message: "로그인 성공, 토큰 저장됨" };
          }
          return { success: true, message: "로그인 성공, 하지만 토큰 없음" };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
          return { success: false, message: "로그인 실패: " + message };
        }
      },

      signOut: async () => {
        try {
          await axiosApi.post("/signout");
          localStorage.removeItem("accessToken");
          set({ memNo: null, memType: null, role: null });
        } catch (err) {
          console.error("로그아웃 실패:", err);
          throw err;
        }
      },
    }),
    {
      name: "auth-storage", // localStorage 키
    }
  )
);
