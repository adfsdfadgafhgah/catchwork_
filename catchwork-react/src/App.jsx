import { createBrowserRouter } from "react-router-dom";
import "./App.css";

// 공통
// 레이아웃 & 페이지 접근 제어
import Layout from "./Layout";
import ProtectedRoute from "./AppRoute";

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

// 개인 회원
// 마이페이지
import MyPage from "./pages/myPage/MyPage";
import MyInfo from "./pages/myPage/MyInfoPage";
import MyRecruitPage from "./pages/myPage/MyRecruitPage";
import MembershipPage from "./pages/myPage/MembershipPage";

// 멤버십
import IssueBillingKeyPage from "./pages/myPage/membership/IssueBillingKeyPage";
import PaymentCheckout from "./pages/myPage/membership/PaymentCheckout";
import PaymentFail from "./pages/myPage/membership/PaymentFail";
import PaymentSuccess from "./pages/myPage/membership/PaymentSuccess";
import UpgradeMembership from "./pages/myPage/membership/UpgradeMembership";
import DowngradeMembership from "./pages/myPage/membership/DowngradeMembership";

//이력서 제출
import SubmitCVPage from "./pages/major/SubmitCVPage";
import WriteCVPage from "./pages/major/WriteCVPage";

// 게시글
import BoardListPage from "./pages/major/BoardListPage";
import BoardDetailPage from "./pages/major/BoardDetailPage";
import WriteBoardPage from "./pages/major/WriteBoardPage";
import EditBoardPage from "./pages/major/EditBoardPage";

// 기업 회원
// 기업 메인
import CorpRecruitListPage from "./pages/corpMajor/CorpRecruitListPage";

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

//test
import AuthTest from "./pages/member/AuthTest";

const router = createBrowserRouter([
  {
    // 전체 요청
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      // 등록된 주소 외 모든 주소 예외 처리
      { path: "*", element: <NotFound /> },
      // 로그인/회원가입
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "auth", element: <AuthTest /> },
      // Id,PW 찾기
      { path: "findid", element: <FindIdPage /> },
      { path: "findpw", element: <FindPWPage /> },

      { path: "recruit", element: <RecruitPage /> },

      { path: "board", element: <BoardPage /> },

      // 로그인 필요, 개인회원 전용 예시
      {
        path: "cv",
        element: (
          <ProtectedRoute allowedType={0}>
            <CVPage />
          </ProtectedRoute>
        ),
      },
      /* 테스트 : 이력서 작성페이지*/
      { path: "writecvpage", element: <WriteCVPage /> },

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
        path: "board",
        element: <BoardPage />,
        children: [
          { index: true, element: <BoardListPage /> },
          { path: ":boardNo", element: <BoardDetailPage /> },
          { path: "write", element: <WriteBoardPage /> },
          { path: "edit/:boardNo", element: <EditBoardPage /> },
        ],
      },

      { path: "cv", element: <CVPage /> },
      { path: "submitcv", element: <SubmitCVPage /> },
      { path: "supportlist", element: <SupportListPage /> },
      { path: "writesupport", element: <WriteSupportPage /> },
      { path: "reportmodal", element: <ReportModalPage /> },
      {
        path: "/supportdetail",
        element: <SupportDetailPage />,
        children: [{ path: ":id", element: <SupportDetailPage /> }],
      },
      {
        path: "/mypage",
        element: <MyPage />,
        children: [
          { index: true, element: <MyInfo /> },
          { path: "home", element: <MyInfo /> },
          { path: "myrecruit", element: <MyRecruitPage /> },
          {
            path: "membership",
            element: <MembershipPage />,
          },
          {
            path: "payment",
            children: [
              { path: "billing", element: <IssueBillingKeyPage /> },
              { path: "checkout", element: <PaymentCheckout /> },
              { path: "fail", element: <PaymentFail /> },
              { path: "sucess", element: <PaymentSuccess /> },
              { path: "upgrade", element: <UpgradeMembership /> },
              { path: "downgrade", element: <DowngradeMembership /> },
            ],
          },
        ],
      },
      /*
  ______   ______   .______      .______      .______      ___       _______  _______     _______.
 /      | /  __  \  |   _  \     |   _  \     |   _  \    /   \     /  _____||   ____|   /       |
|  ,----'|  |  |  | |  |_)  |    |  |_)  |    |  |_)  |  /  ^  \   |  |  __  |  |__     |   (----`
|  |     |  |  |  | |      /     |   ___/     |   ___/  /  /_\  \  |  | |_ | |   __|     \   \    
|  `----.|  `--'  | |  |\  \----.|  |         |  |     /  _____  \ |  |__| | |  |____.----)   |   
 \______| \______/  | _| `._____|| _|    _____| _|    /__/     \__\ \______| |_______|_______/    
                                        |______|                                                  
      */
      { path: "corp", element: <CorpRecruitListPage /> },

      // 기업 회원
      { path: "corpcvlist", element: <CorpCVListPage /> },
      {
        path: "corpcompanydetail",
        element: <CorpCompanyPage />,
        children: [
          { path: ":corpNo", element: <CorpCompanyDetailPage /> },
          { path: ":corpNo/edit", element: <EditCompanyPage /> },
        ],
      },

      // 기업 마이 페이지
      { path: "corpmypage", element: <CorpMyPage /> },
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
      // 로그인 필요 페이지 예시
      // <ProtectedRoute> 으로 감싸기 +@ children도 접속 불가
      {
        path: "board",
        element: (
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <BoardListPage /> },
          { path: ":boardNo", element: <BoardDetailPage /> },
          { path: "write", element: <WriteBoardPage /> },
          { path: "edit/:boardNo", element: <EditBoardPage /> },
        ],
      },



      // 개인회원 예시
      // <ProtectedRoute allowedType={0}> 으로 감싸기
      {
        path: "cv",
        element: (
          <ProtectedRoute allowedType={0}>
            <CVPage />
          </ProtectedRoute>
        ),
      },



      // 기업회원 예시
      // <ProtectedRoute allowedType={1}> 으로 감싸기
      {
        path: "corpcvlist",
        element: (
          <ProtectedRoute allowedType={1}>
            <CorpCVListPage />
          </ProtectedRoute>
        ),
      },
*/
