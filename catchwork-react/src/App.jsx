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
import CorpRegisterPage from "./pages/member/CorpRegisterPage";
import CeoSignUpPage from "./pages/member/CeoSignUpPage";

// Id,PW 찾기
import FindIdPage from "./pages/member/FindIdPage";
import FindPWPage from "./pages/member/FindPWPage";

// 네비게이션
import MemberRecruitPage from "./pages/major/MemberRecruitPage";
import CompanyListPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardPage";
import CVListPage from "./pages/major/CVListPage";
import CVPage from "./pages/major/CVPage";

// 개인 회원
// 마이페이지
import MyPage from "./pages/myPage/MyPage";
import MyInfo from "./pages/myPage/MyInfoPage";
import MyRecruitPage from "./pages/myPage/MyRecruitPage";
import FavRecruitPage from "./pages/myPage/FavRecruitPage";
import FavCompanyPage from "./pages/myPage/FavCompanyPage";
import FavBoardPage from "./pages/myPage/FavBoardPage";
import MembershipPage from "./pages/myPage/MembershipPage";
import MyBoardListPage from "./pages/myPage/MyBoardListPage";
import MyCommentListPage from "./pages/myPage/MyCommentListPage";
import EditMyInfoPage from "./pages/myPage/EditMyInfoPage";
import ChangePwPage from "./pages/myPage/ChangePwPage";
import WithdrawPage from "./pages/myPage/WithdrawPage";

// 멤버십
import IssueBillingKeyPage from "./pages/myPage/membership/IssueBillingKeyPage";
import PaymentCheckout from "./pages/myPage/membership/PaymentCheckout";
import PaymentFail from "./pages/myPage/membership/PaymentFail";
import PaymentSuccess from "./pages/myPage/membership/PaymentSuccess";

//검색
import SearchResultPage from "./pages/major/SearchResultPage";

//이력서 제출
import SubmitCVPage from "./pages/major/SubmitCVPage";
import CVManagePage from "./pages/major/CVManagePage";

// 게시글
import BoardListPage from "./pages/major/BoardListPage";
import BoardDetailPage from "./pages/major/BoardDetailPage";
import WriteBoardPage from "./pages/major/WriteBoardPage";
import EditBoardPage from "./pages/major/EditBoardPage";

// 개인 공고
import MemberRecruitListPage from "./pages/major/MemberRecruitListPage";
import MemberRecruitDetailPage from "./pages/major/MemberRecruitDetailPage";

// 기업 회원
// 기업 메인
// 기업 공고
import CorpRecruitPage from "./pages/corpMajor/CorpRecruitPage";
import CorpRecruitListPage from "./pages/corpMajor/CorpRecruitListPage";
import WriteRecruitPage from "./pages/corpMajor/WriteRecruitPage";
import CorpRecruitDetailPage from "./pages/corpMajor/CorpRecruitDetailPage";
import EditRecruitPage from "./pages/corpMajor/EditRecruitPage";

// 기업상세
import CompanyPage from "./pages/major/CompanyPage";
import CompanyDetailPage from "./pages/major/CompanyDetailPage";

// 문의
import SupportListPage from "./pages/support/SupportListPage";
import WriteSupportPage from "./pages/support/WriteSupportPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";

// 기업 마이페이지
import CorpMyPage from "./pages/corpMyPage/CorpMyPage";
import CorpMyInfoPage from "./pages/corpMyPage/CorpMyInfoPage";
import CorpEditMyInfoPage from "./pages/corpMyPage/CorpEditMyInfoPage";
import CorpConfirmEditPage from "./pages/corpMyPage/CorpConfirmEditPage";
import CorpChangePwPage from "./pages/corpMyPage/CorpChangePwPage";
import CorpWithdrawPage from "./pages/corpMyPage/CorpWithdrawPage";

//기업 정보, 기업 정보 수정
import CorpCompanyDetailPage from "./pages/corpMajor/CorpCompanyDetailPage";
import EditCompanyPage from "./pages/corpMajor/EditCompanyPage";
import CorpCompanyPage from "./pages/corpMajor/CorpCompanyPage";

//기업 제출된 이력서 목록
import CorpCVListPage from "./pages/corpMajor/CorpCVListPage";

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
      { path: "corpregister", element: <CorpRegisterPage /> },
      { path: "ceosignup", element: <CeoSignUpPage /> },
      { path: "auth", element: <AuthTest /> },

      // Id,PW 찾기
      { path: "findid", element: <FindIdPage /> },
      { path: "findpw", element: <FindPWPage /> },

      // 로그인 필요, 개인회원 전용 예시
      {
        path: "cv",
        element: (
          <ProtectedRoute allowedType={0}>
            <CVPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <CVListPage /> },
          /* 이력서 CRUD페이지*/
          { path: "cvmanage", element: <CVManagePage /> },
        ],
      },

      // 개인 공고
      {
        path: "memberrecruit",
        element: <MemberRecruitPage />,
        children: [
          { index: true, element: <MemberRecruitListPage /> },
          { path: ":recruitNo", element: <MemberRecruitDetailPage /> },
        ],
      },

      // 개인 기업
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

      //검색
      { path: "search", element: <SearchResultPage /> },

      //이력서
      { path: "submitcv", element: <SubmitCVPage /> },

      //신고
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
        element: (
          <ProtectedRoute allowedType={0}>
            <MyPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <MyInfo /> },
          { path: "home", element: <MyInfo /> },
          { path: "myrecruit", element: <MyRecruitPage /> },
          { path: "favrecruit", element: <FavRecruitPage /> },
          { path: "favcompany", element: <FavCompanyPage /> },
          { path: "favboard", element: <FavBoardPage /> },
          { path: "myboard", element: <MyBoardListPage /> },
          { path: "mycomment", element: <MyCommentListPage /> },
          {
            path: "membership",
            element: <MembershipPage />,
          },
          { path: "editmyinfo", element: <EditMyInfoPage /> },
          { path: "changepw", element: <ChangePwPage /> },
          { path: "withdraw", element: <WithdrawPage /> },
          {
            path: "payment",
            children: [
              { path: "billing", element: <IssueBillingKeyPage /> },
              { path: "checkout", element: <PaymentCheckout /> },
              { path: "fail", element: <PaymentFail /> },
              { path: "sucess", element: <PaymentSuccess /> },
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

      // 기업 공고
      {
        path: "corprecruit",
        element: <CorpRecruitPage />,
        children: [
          { index: true, element: <CorpRecruitListPage /> },
          { path: "write", element: <WriteRecruitPage /> },
          { path: ":recruitNo", element: <CorpRecruitDetailPage /> },
          { path: "edit/:recruitNo", element: <EditRecruitPage /> },
        ],
      },

      //기업 정보 상세, 수정
      {
        path: "corpcompany",
        element: <CorpCompanyPage />,
        children: [
          { index: true, element: <CorpCompanyDetailPage /> },
          { path: "detail", element: <CorpCompanyDetailPage /> },
          { path: "update", element: <EditCompanyPage /> },
        ],
      },

      // 기업 이력서
      { path: "corpcvlist", element: <CorpCVListPage /> },

      // 기업 마이 페이지
      {
        path: "/corpmypage",
        element: (
          <ProtectedRoute allowedType={1}>
            <CorpMyPage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <CorpMyInfoPage /> },
          { path: "home", element: <CorpMyInfoPage /> },
        ],
      },
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
