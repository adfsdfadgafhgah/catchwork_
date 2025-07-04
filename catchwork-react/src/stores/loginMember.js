import { create } from "zustand";
import { axiosApi } from "../api/axiosAPI";
import { useAuthStore } from "./authStore";

const useLoginMember = create((set) => ({
  loginMember: {},
  isLoadingLogin: false,
  setLoginMember: async () => {
    try {
      const memNo = useAuthStore.getState().memNo;
      if (!memNo) {
        set({ isLoadingLogin: true });
        return;
      }
      const resp = await axiosApi.post("/member/getLoginMember", { memNo });

      if (resp.status === 200) {
        set({ loginMember: resp.data, isLoadingLogin: true });
      } else {
        set({ isLoadingLogin: true });
      }
    } catch (error) {
      console.error("Failed to fetch loginMember:", error);
    }
  },
}));

export default useLoginMember;
