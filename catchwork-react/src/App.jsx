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
import RecruitPage from './pages/major/RecruitListPage'
import CompanyPage from './pages/major/CompanyListPage'
import BoardPage from './pages/major/BoardListPage'
import CvPage from './pages/major/CVListPage'

// 마이페이지용
import MyPage from './pages/myPage/MyPage'
import MyInfo from "./pages/myPage/MyInfoPage";

// 문의
import SupportListPage from './pages/support/SupportListPage';
import WriteSupportPage from "./pages/support/WriteSupportPage";
import SupportDetailPage from './pages/support/SupportDetailPage';

// 기업용 마이페이지
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
      { path: 'cv', element: <CvPage />, },
      { path: 'supportlist', element: <SupportListPage/>, },
      { path: 'writesupport', element: <WriteSupportPage/>, },
      { path: 'corpmypage', element: <CorpMyPage/>, },
      { path: 'reportmodal', element: <ReportModalPage/>, },
      
      {
        path: '/supportdetail',
        element: <SupportDetailPage />, // 공통 wrapper 컴포넌트
        children: [
          { path: ':id', element: <SupportDetailPage /> }, // 로컬호스트/supportdetail/id
        ]
      },


      {
        path: '/mypage',
        element: <MyPage />, // 공통 wrapper 컴포넌트
        children: [
          { path: 'home', element: <MyInfo /> }, // 로컬호스트/mypage/home
        ]
      },
      { path: '*', element: <NotFound /> },
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