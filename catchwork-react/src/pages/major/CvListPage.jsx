import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLoginMember from "../../stores/loginMember";
import CVItem from "../../components/cv/CVItem";
import { axiosApi } from "../../api/axiosAPI";
import { Outlet } from "react-router-dom";
import "./CVListPage.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CVListPage = () => {
  // 쿼리스트링
  const query = useQuery();

  // 공고 번호 있으면 가져오기(detail)
  const recruitNo = query.get("recruitNo");
  const mode = (recruitNo ? "submit" : "edit");

  // 페이지 이동
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
      const res = await axiosApi.post("/memberCV/list", { memNo: loginMember.memNo });
      setCvList(res.data || []);
    } catch (e) {
      console.error(e);
      alert("이력서 목록을 가져오는데 실패했습니다.");
    } finally {
      setIsLoadingList(false);
    }
  };

  // 작성 버튼
  const handleAdd = () => {
    navigate("/cv/cvmanage");
  }

  // 수정 버튼
  const handleEdit = (cvNo) => {
    navigate(`/cv/cvmanage?cvNo=${cvNo}&mode=update`);
  };
  
  // 삭제 버튼
  const handleDelete = async (cvNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosApi.post("/memberCV/delete", { cvNo });
      alert("삭제 완료");
      fetchCVList();
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 제출 버튼
  const handleSubmit = async (cvNo, recruitNo) => {
    navigate(`/cv/cvmanage?cvNo=${cvNo}&recruitNo=${recruitNo}&mode=submit`);
  }

  return (
    <div className="cv-list-container">
      <h1 className="cv-list-title">내 이력서</h1>
      <span>
        {mode === "edit" && (
          <button className="addButton" onClick={() => handleAdd()}>
            작성하기
          </button>
        )}
      </span>

      {isLoadingList ? (
        <p>목록을 불러오는 중...</p>
      ) : cvList.length === 0 ? (
        <p>이력서가 없습니다.</p>
      ) : (
        cvList.map((cv) => (
          <CVItem
            key={cv.cvNo}
            cv={cv}
            recruitNo = {recruitNo}
            mode={mode}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        ))
      )}
      <Outlet />
    </div>
  );
};

export default CVListPage;
