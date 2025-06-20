import { createBrowserRouter } from "react-router-dom";
import "./App.css";

// 레이아웃
import Layout from "./Layout";

// 오류 및 메인
import NotFound from "./pages/error/NotFound";
import MainPage from "./pages/major/MainPage";

// 회원
import SignInPage from "./pages/member/SignInPage";
import SignUpPage from "./pages/member/SignUpPage";

// 네비게이션
import RecruitPage from "./pages/major/RecruitListPage";
import CompanyPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardListPage";
import CvPage from "./pages/major/CVListPage";

// 마이페이지용용
import MyPage from "./pages/myPage/MyPage";
import MyInfo from "./pages/myPage/MyInfoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "recruit", element: <RecruitPage /> },
      { path: "company", element: <CompanyPage /> },
      { path: "/board", element: <BoardPage /> },
      { path: "cv", element: <CvPage /> },

      {
        path: "/mypage",
        element: <MyPage />, // 공통 wrapper 컴포넌트
        children: [
          { path: "home", element: <MyInfo /> }, // 로컬호스트/mypage/home
        ],
      },
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
