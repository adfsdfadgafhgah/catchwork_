import { createBrowserRouter } from "react-router-dom";
import "./App.css";

 // 레이아웃
import Layout from './Layout';

// 오류 및 메인
import NotFound from './pages/error/NotFound'
import MainPage from './pages/major/MainPage'

// 회원
import SignInPage from './pages/member/SignInPage'
import SignUpPage from './pages/member/SignUpPage'

// 네비게이션
import RecruitPage from "./pages/major/RecruitListPage";
import CompanyPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardPage";
import BoardListPage from "./pages/major/BoardListPage";
import BoardDetailPage from "./pages/major/BoardDetailPage";
import CVPage from "./pages/major/CVListPage";

// 마이페이지용용
import MyPage from './pages/myPage/MyPage'
import MyInfo from "./pages/myPage/MyInfoPage";
import MyRecruitPage from "./pages/myPage/MyRecruitPage";

//이력서 제출
import SubmitCVPage from "./pages/major/SubmitCVPage";

// 기업상세
import CompanyDetailPage from "./pages/major/CompanyDetailPage";

// 문의
import SupportListPage from './pages/support/SupportListPage';
import WriteSupportPage from "./pages/support/WriteSupportPage";
import SupportDetailPage from './pages/support/SupportDetailPage';

// 기업 마이페이지
import CorpMyPage from './pages/corpMypage/CorpMyPage';

// 신고하기
import ReportModalPage from './pages/support/ReportModalPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'recruit', element: <RecruitPage /> },
      { path: 'company', element: <CompanyPage /> },
      { path: '/board', element: <BoardPage /> },
      { path: 'cv', element: <CVPage />, },

      // 로그인/회원가입
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },

      // Id,PW 찾기
      { path: "findid", element: <FindIdPage /> },
      { path: "findpw", element: <FindPWPage /> },
                   
                   
      { path: "recruit", element: <RecruitPage /> },
      { path: "company", element: <CompanyPage /> },
      { path: "company/:corpNo", element: <CompanyDetailPage /> },
      {
        path: "/board",
        element: <BoardPage />,
        children: [
          { index: true, element: <BoardListPage /> },
          { path: ":id", element: <BoardDetailPage /> },
        ],
      },
      { path: "submitcv", element: <SubmitCVPage /> },
      { path: 'supportlist', element: <SupportListPage/>, },
      { path: 'writesupport', element: <WriteSupportPage/>, },
      { path: 'corpmypage', element: <CorpMyPage/>, },
      { path: 'reportmodal', element: <ReportModalPage/>, },
      
      {
        path: '/supportdetail',
        element: <SupportDetailPage />,
        children: [
          { path: ':id', element: <SupportDetailPage /> },
        ]
      },

      {
        path: "/mypage",
        element: <MyPage />,
        children: [
          { index: true, element: <MyInfo /> },
          { path: "home", element: <MyInfo /> },
          { path: "myrecruit", element: <MyRecruitPage /> },

        ],
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