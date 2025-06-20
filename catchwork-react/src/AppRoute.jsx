import { Routes, Route } from 'react-router-dom';

import NotFound from './pages/error/NotFound'

import MainPage from './pages/major/MainPage'
import SignInPage from './pages/member/SignInPage'
import SignUpPage from './pages/member/SignUpPage'

import RecruitPage from './pages/major/RecruitListPage'
import CompanyPage from './pages/major/CompanyListPage'
import BoardPage from './pages/major/BoardListPage'
import MyPage from './pages/myPage/MyPage'
import CvPage from './pages/major/CVListPage'
import CorpMyPage  from './pages/corpMypage/CorpMyPage' // 명하 기업 마이페이지 작성
import WriteSupportPage from './pages/support/WriteSupportPage' // 명하 문의 작성
import SupportListPage from './pages/support/SupportListPage'; // 명하 문의 리스트
import SupportDetailPage from './pages/support/SupportDetailPage'; // 명하 문의 상세

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
          <Route path="/mypage" element={<MyPage />} />

          <Route path="/cv" element={<CvPage />} />
       
          <Route path="/corpmypage" element={<CorpMyPage />} />  {/* 명하 */}
          <Route path="/writesupport" element={<WriteSupportPage />} />  {/* 명하 */}
          <Route path="/support/list" element={<SupportListPage />} /> {/* 명하 */}
          <Route path="/support/detail/:id" element={<SupportDetailPage />} />  {/* 명하 */}
        </Routes>
      </main>
    </>
  )
}

export default AppRoute
