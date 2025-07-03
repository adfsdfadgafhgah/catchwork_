import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginMember from "../../stores/loginMember";
import CvItem from "../../components/cv/CvItem";
import { axiosApi } from "../../api/axiosAPI";
import { Outlet } from "react-router-dom";
import "./CVListPage.css";

const CVListPage = () => {
  const navigate = useNavigate();
  const { loginMember, setLoginMember, isLoadingLogin } = useLoginMember();

  const [cvList, setCvList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    setLoginMember();
  }, []);

  useEffect(() => {
    if (!isLoadingLogin) return;

    if (!loginMember.memNo) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
    } else {
      fetchCVList();
    }
  }, [isLoadingLogin, loginMember, navigate]);

  // 이력서 리스트 조회
  const fetchCVList = async () => {
    try {
      setIsLoadingList(true);
      const res = await axiosApi.post("/cv/list", { memNo: loginMember.memNo });
      setCvList(res.data || []);
    } catch (e) {
      console.error(e);
      alert("이력서 목록을 가져오는데 실패했습니다.");
    } finally {
      setIsLoadingList(false);
    }
  };

  // 수정 버튼
  const handleEdit = (cvNo) => {
    navigate(`/cv/cvmanage?cvNo=${cvNo}&mode=update`);
  };
  
  // 삭제 버튼
  const handleDelete = async (cvNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosApi.post("/cv/delete", { cvNo });
      alert("삭제 완료");
      fetchCVList();
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="cv-list-container">
      <h1 className="cv-list-title">내 이력서</h1>

      {isLoadingList ? (
        <p>목록을 불러오는 중...</p>
      ) : (
        cvList.map((cv) => (
          <CvItem
            key={cv.cvNo}
            cv={cv}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
      <Outlet />
    </div>
  );
};

export default CVListPage;
