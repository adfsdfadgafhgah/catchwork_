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
import CompanyListPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardPage";
import CVPage from "./pages/major/CVListPage";

// 마이페이지
import MyPage from "./pages/myPage/MyPage";
import MyInfo from "./pages/myPage/MyInfoPage";
import MyRecruitPage from "./pages/myPage/MyRecruitPage";

//이력서 제출
import SubmitCVPage from "./pages/major/SubmitCVPage";

// 게시글
import BoardListPage from "./pages/major/BoardListPage";
import BoardDetailPage from "./pages/major/BoardDetailPage";

// 기업상세
import CompanyPage from "./pages/major/CompanyPage";
import CompanyDetailPage from "./pages/major/CompanyDetailPage";

// 문의
import SupportListPage from "./pages/support/SupportListPage";
import WriteSupportPage from "./pages/support/WriteSupportPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";

// 기업 마이페이지
import CorpMyPage from "./pages/corpMypage/CorpMyPage";
import CorpEditMyInfoPage from "./pages/corpMypage/CorpEditMyInfoPage";
import CorpConfirmEditPage from "./pages/corpMypage/CorpConfirmEditPage";
import CorpChangePwPage from "./pages/corpMypage/CorpChangePwPage";
import CorpWithdrawPage from "./pages/corpMypage/CorpWithdrawPage";

//기업 제출된 이력서 목록
import CorpCVListPage from "./pages/corpMajor/CorpCVListPage";

//기업 정보, 기업 정보 수정
import CorpCompanyDetailPage from "./pages/corpMajor/CorpCompanyDetailPage";
import EditCompanyPage from "./pages/corpMajor/EditCompanyPage";
import CorpCompanyPage from "./pages/corpMajor/CorpCompanyPage";

// 신고하기
import ReportModalPage from "./pages/support/ReportModalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "recruit", element: <RecruitPage /> },

      { path: "board", element: <BoardPage /> },
      { path: "cv", element: <CVPage /> },

      // 로그인/회원가입
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },

      // Id,PW 찾기
      { path: "findid", element: <FindIdPage /> },
      { path: "findpw", element: <FindPWPage /> },

      { path: "recruit", element: <RecruitPage /> },
      {
        path: "company",
        element: <CompanyPage />,
        children: [
          { index: true, element: <CompanyListPage /> },
          { path: ":corpNo", element: <CompanyDetailPage /> },
        ],
      },

      // 게시글
      {
        path: "/board",
        element: <BoardPage />,
        children: [
          { index: true, element: <BoardListPage /> },
          { path: ":boardNo", element: <BoardDetailPage /> },
        ],
      },

      { path: "cv", element: <CVPage /> },
      { path: "submitcv", element: <SubmitCVPage /> },
      { path: "supportlist", element: <SupportListPage /> },
      { path: "writesupport", element: <WriteSupportPage /> },
      { path: "reportmodal", element: <ReportModalPage /> },

      { path: "corpcvlist", element: <CorpCVListPage /> },
      {
        path: "corpcompanydetail",
        element: <CorpCompanyPage />,
        children: [
          { path: ":corpNo", element: <CorpCompanyDetailPage /> },
          { path: ":corpNo/edit", element: <EditCompanyPage /> },
        ],
      },

      {
        path: "/supportdetail",
        element: <SupportDetailPage />,
        children: [{ path: ":id", element: <SupportDetailPage /> }],
      },
      { path: "corpmypage", element: <CorpMyPage /> },

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

      // 기업 페이지
      { path: "corpeditmyinfo", element: <CorpEditMyInfoPage /> },
      { path: "corpconfirmedit", element: <CorpConfirmEditPage /> },
      { path: "corpchangepw", element: <CorpChangePwPage /> },
      { path: "corpwithdraw", element: <CorpWithdrawPage /> },
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
