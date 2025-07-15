import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import useLoginMember from "../../stores/loginMember";
import { axiosApi } from "../../api/axiosAPI";
import "./CorpMyPage.css";

const CorpMyPage = () => {
  const { loginMember, setLoginMember } = useLoginMember();
  const [corpInfo, setCorpInfo] = useState(null);

  useEffect(() => {
    setLoginMember();

    // 이거 해야 기업명 보임
    axiosApi.get("/corp/mypage", { withCredentials: true })
      .then((res) => {
        setCorpInfo(res.data);
      })
      .catch((err) => {
        console.error("기업 정보 조회 실패", err);
      });
  }, []);

  return (
    <div className="corpmypage-container">
      <CorpSideBar />
      <div className="corpmypage-content">
        <Outlet context={{ loginMember, setLoginMember, corpInfo }} />
      </div>
    </div>
  );
};

export default CorpMyPage;
