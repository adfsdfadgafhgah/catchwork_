import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosApi } from "../api/axiosAPI";
import { getDecodedToken } from "../api/jwtDecode";
import useLoginMember from "../stores/loginMember";

export const useAuthStore = create(
  persist(
    (set) => ({
      memNo: null,
      memNickname: null,
      memType: null,

      signin: async (memId, memPw) => {
        try {
          const res = await axiosApi.post("/signin", { memId, memPw });
          const token = res.headers.authorization?.split(" ")[1];
          if (token) {
            localStorage.setItem("accessToken", token);
            const decoded = getDecodedToken(token);
            set({
              memNo: decoded.memNo,
              memNickname: decoded.memNickname,
              memType: decoded.memType,
            });
            await useLoginMember.getState().setLoginMember();
            return { success: true, message: "로그인 성공" };
          }
          return { success: true, message: "로그인 성공( 토큰 발급 실패 )" };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
          return { success: false, message: message };
        }
      },

      signOut: async () => {
        try {
          await axiosApi.post("/signout");
          localStorage.removeItem("accessToken");
          set({
            memNo: null,
            memNickname: null,
            memType: null,
          });
          useLoginMember.getState().clearLoginMember();
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
