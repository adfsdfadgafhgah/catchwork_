import { createBrowserRouter } from "react-router-dom";
import "./App.css";

// 레이아웃
import Layout from "./Layout";

// 오류 및 메인
import NotFound from "./pages/error/NotFound";
import MainPage from "./pages/major/MainPage";

// 로그인/회원가입
import SignInPage from "./pages/member/SignInPage";
import SignUpPage from "./pages/member/SignUpPage";

// Id,PW 찾기
import FindIdPage from "./pages/member/FindIdPage";
import FindPWPage from "./pages/member/FindPWPage";

// 네비게이션
import RecruitPage from "./pages/major/RecruitListPage";
import CompanyPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardListPage";
import CvPage from "./pages/major/CVListPage";

// 마이페이지용
import MyPage from "./pages/myPage/MyPage";
import MyInfo from "./pages/myPage/MyInfoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },

      // 로그인/회원가입
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },

      // Id,PW 찾기
      { path: "findid", element: <FindIdPage /> },
      { path: "findpw", element: <FindPWPage /> },

      { path: "recruit", element: <RecruitPage /> },
      { path: "company", element: <CompanyPage /> },
      { path: "/board", element: <BoardPage /> },
      { path: "cv", element: <CvPage /> },

      {
        path: "/mypage",
        element: <MyPage />,
        children: [{ path: "home", element: <MyInfo /> }],
      },

      // 등록된 주소 외 모든 주소 예외 처리
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;

/*
참조
      {
        path: '/board',
        element: <BoardPage />, // 공통 wrapper 컴포넌트
        children: [
          { index: true, element: <BoardListPage /> }, // /board
          { path: ':id', element: <BoardDetailPage /> }, // /board/123
          { path: 'write', element: <BoardWritePage /> }, // /board/write
        ]
      },
*/
