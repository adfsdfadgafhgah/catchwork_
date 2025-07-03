import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./SubmitCVPage.css";
import SectionHeader from "../../components/common/SectionHeader";
import { axiosApi } from "../../api/axiosAPI";

const SubmitCVPage = () => {
  const [resumeList, setResumeList] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation(); // ✅ state에서 recruitNo 추출
  const recruitNo = state?.recruitNo;
  //실제 로그인한 회원 번호로 대체
  const memNo = "d7b41663-bb55-42e0-a533-4e6c09a18097";

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/cvlist?memNo=${memNo}`
        );
        setResumeList(response.data);
      } catch (err) {
        console.error("이력서 목록 불러오기 실패", err);
        setError("이력서를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);
  const handleSubmit = async () => {
    if (selectedResume === null) {
      alert("이력서를 선택하세요!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/submitcv", {
        memNo,
        cvNo: selectedResume,
        recruitNo,
      });

      alert("제출 완료!");
    } catch (error) {
      console.error("제출 실패:", error);
      alert("제출 실패");
    }
  };
  // recruitNo 없을 경우 잘못된 접근으로 처리
  if (!recruitNo) {
    return (
      <main className="container">
        <SectionHeader title="이력서 선택" />
        <p>잘못된 접근입니다. 공고를 선택 후 다시 시도해 주세요.</p>
      </main>
    );
  }

  return (
    <>
      <main className="container">
        <SectionHeader title="이력서 선택" />

        <div className="resume-list">
          {resumeList.length > 0 ? (
            resumeList.map((resume) => (
              <label key={resume.cvNo} className="resume-item">
                <input
                  type="radio"
                  name="resume"
                  value={resume.cvNo}
                  checked={selectedResume === resume.cvNo}
                  onChange={() => setSelectedResume(resume.cvNo)}
                />
                <div className="resume-name">
                  {resume.cvMainFl === "Y" && (
                    <span className="resume-badge">대표 이력서</span>
                  )}
                  {resume.cvAlias}
                </div>

                <div className="resume-date">{resume.createdDate}</div>
              </label>
            ))
          ) : (
            <p>이력서가 없습니다.</p>
          )}
        </div>

        {/* 이력서가 없으면 제출하기 버튼 안뜨게 */}
        {resumeList.length > 0 && (
          <button className="submitcv-btn" onClick={handleSubmit}>
            제출하기
          </button>
        )}
      </main>
    </>
  );
};

export default SubmitCVPage;
