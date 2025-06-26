import { useState } from "react";
import axios from "axios";
import "./SubmitCVPage.css";
import SectionHeader from "../../components/common/SectionHeader";

const SubmitCVPage = () => {
  // 더미 데이터 (임시 데이터)
  const [resumeList, setResumeList] = useState([
    {
      cvNo: 1,
      cvAlias: "이윤진 JAVA 개발자 이력서",
      cvMainFl: "Y",
      createdDate: "2025.06.17",
    },
    {
      cvNo: 2,
      cvAlias: "이윤진 이력서 최근 경력사항 수정본",
      cvMainFl: "N",
      createdDate: "2025.06.15",
    },
    {
      cvNo: 3,
      cvAlias: "이윤진 포트폴리오 수정본",
      cvMainFl: "N",
      createdDate: "2025.06.14",
    },
  ]);

  const [selectedResume, setSelectedResume] = useState(null);

  // 서버 연결 전이므로 handleSubmit 도 임시 처리
  const handleSubmit = () => {
    if (selectedResume === null) {
      alert("이력서를 선택하세요!");
    } else {
      alert(`선택한 이력서 ID: ${selectedResume}`);
    }
  };

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
                  {resume.cvTitle}
                </div>

                <div className="resume-date">{resume.createdDate}</div>
              </label>
            ))
          ) : (
            <p>이력서가 없습니다.</p>
          )}
        </div>

        <button className="submitcv-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </main>
    </>
  );
};

export default SubmitCVPage;
