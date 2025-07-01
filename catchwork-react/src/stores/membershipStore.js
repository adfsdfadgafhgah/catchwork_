import { create } from "zustand";
import { axiosApi } from "../api/axiosAPI";

const useMembershipList = create((set) => (
  {
    membershipList: [], // 초기값 빈배열
    getMembershipList: async () => {
      try {
        const resp = await axiosApi.get("/membership/getMembershipList");
        if (resp.status === 200) {
          set({ membershipList: resp.data });
        }
      } catch (error) {
        console.error("Failed to fetch membership list:", error);
      }
    },
  }
));

export default useMembershipList;
