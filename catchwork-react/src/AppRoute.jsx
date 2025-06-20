import { Routes, Route } from "react-router-dom";

import NotFound from "./pages/error/NotFound";

import MainPage from "./pages/major/MainPage";
import SignInPage from "./pages/member/SignInPage";
import SignUpPage from "./pages/member/SignUpPage";

import RecruitPage from "./pages/major/RecruitListPage";
import CompanyPage from "./pages/major/CompanyListPage";
import BoardPage from "./pages/major/BoardListPage";
import CvPage from "./pages/major/CVListPage";
import MyPage from "./pages/myPage/MyPage";
import MyInfoPage from "./pages/myPage/MyInfoPage";
import MyRecruitPage from "./pages/myPage/MyRecruitPage";

function AppRoute() {
  const myPageRoutes = {
    path: "/mypage",
    element: <MyPage />,
    children: [
      { path: "", element: <MyInfoPage /> },
      { path: "myrecruit", element: <MyRecruitPage /> },
    ],
  };

  return (
    <>
      <main>
        <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<MainPage />} />

          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/recruit" element={<RecruitPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/cv" element={<CvPage />} />

          <Route path="/mypage" element={<MyPage />}>
            <Route path="home" element={<MyInfoPage />} />
            <Route path="myrecruit" element={<MyRecruitPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default AppRoute;
