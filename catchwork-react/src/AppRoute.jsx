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

import SubmitCvPage from "./pages/major/SubmitCvPage";

function AppRoute() {
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

          <Route path="/mypage" element={<MyPage />} />

          {/*윤진*/}
          <Route path="/submitcvpage" element={<SubmitCvPage />} />
        </Routes>
      </main>
    </>
  );
}

export default AppRoute;
