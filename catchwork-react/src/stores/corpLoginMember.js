// import { create } from "zustand";
// import { axiosApi } from "../api/axiosAPI";
// import { useAuthStore } from "./authStore";

// export const useCorpLoginMember = create((set) => ({
//   fetchCorpMember: async () => {
//     try {
//       const memNo = useAuthStore.getState().memNo;
//       if (!memNo) {
//         console.error("memNo가 없습니다. 로그인 상태인지 확인하세요.");
//         return;
//       }

//       const resp = await axiosApi.post("/getCorpLoginMember", { memNo });

//       if (resp.status === 200 && typeof resp.data === "object") {
//         const { memNo, memNickname, memType, corpNo } = resp.data;
//         console.log("서버에서 받은 로그인 멤버:", resp.data);

//         set({
//           memNo,
//           memNickname,
//           memType,
//           corpNo,
//         });
//       }
//     } catch (err) {
//       console.error("기업 로그인 멤버 정보 불러오기 실패:", err);
//     }
//   },
// }));
