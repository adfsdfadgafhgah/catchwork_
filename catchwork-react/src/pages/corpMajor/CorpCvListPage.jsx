import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import "./CorpCvListPage.css";

const CorpCvListPage = () => {
  const [cvList, setCvList] = useState([
    {
      recruitCvNo: 10,
      recruitCvPdfTitle: "이윤진 이력서 최근 경력사항 수정본",
      date: "2025.06.23",
      recruitCvEdu: "박사",
      recruitCvCareer: "7-9",
      isDownloaded: false,
    },
    {
      recruitCvNo: 9,
      recruitCvPdfTitle: "허배령 이력서",
      date: "2025.06.22",
      recruitCvEdu: "박사",
      recruitCvCareer: "1-3",
      isDownloaded: false,
    },
    {
      recruitCvNo: 8,
      recruitCvPdfTitle: "신입 이력서 최종",
      date: "2025.06.20",
      recruitCvEdu: "석사",
      recruitCvCareer: "4-6",
      isDownloaded: false,
    },
    {
      recruitCvNo: 7,
      recruitCvPdfTitle: "원기찬_최종_최종",
      date: "2025.06.18",
      recruitCvEdu: "석사",
      recruitCvCareer: "7-9",
      isDownloaded: false,
    },
    {
      recruitCvNo: 6,
      recruitCvPdfTitle: "조민정 이력서 입니다",
      date: "2025.06.16",
      recruitCvEdu: "학사",
      recruitCvCareer: "1-3",
      isDownloaded: false,
    },
    {
      recruitCvNo: 5,
      recruitCvPdfTitle: "김성원 백엔드 개발자 이력서",
      date: "2025.06.14",
      recruitCvEdu: "학사",
      recruitCvCareer: "4-6",
      isDownloaded: false,
    },
    {
      recruitCvNo: 4,
      recruitCvPdfTitle: "김영민 프론트엔드 개발자 이력서",
      date: "2025.06.12",
      recruitCvEdu: "전문학사",
      recruitCvCareer: "10-15",
      isDownloaded: false,
    },
    {
      recruitCvNo: 3,
      recruitCvPdfTitle: "최재이 이력서_최종",
      date: "2025.06.10",
      recruitCvEdu: "전문학사",
      recruitCvCareer: "10-15",
      isDownloaded: false,
    },
    {
      recruitCvNo: 2,
      recruitCvPdfTitle: "허재호 개발자 이력서",
      date: "2025.06.08",
      recruitCvEdu: "고졸",
      recruitCvCareer: "16-20",
      isDownloaded: false,
    },
    {
      recruitCvNo: 1,
      recruitCvPdfTitle: "신입자 이력서_최최최종",
      date: "2025.06.05",
      recruitCvEdu: "고졸",
      recruitCvCareer: "21+",
      isDownloaded: false,
    },
  ]);

  const [selectedEdu, setSelectedEdu] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [filteredList, setFilteredList] = useState(cvList);
  const [selectedCvNos, setSelectedCvNos] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);

  const handleFilter = () => {
    const result = cvList.filter((cv) => {
      const eduMatch = selectedEdu === "" || cv.recruitCvEdu === selectedEdu;
      const expMatch = selectedExp === "" || cv.recruitCvCareer === selectedExp;
      return eduMatch && expMatch;
    });
    setFilteredList(result);
    setSelectedCvNos([]);
  };

  const handleCheckboxChange = (cvNo) => {
    setSelectedCvNos((prev) =>
      prev.includes(cvNo) ? prev.filter((no) => no !== cvNo) : [...prev, cvNo]
    );
  };

  const handleDownload = (cvNo, cvTitle) => {
    // mock fetch — 실제 서버에 연결되면 여기에 다운로드 요청
    fetch(`/api/cv/download/${cvNo}`, { method: "GET" })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `${cvTitle}.pdf`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // 다운로드 후 N → Y 로 업데이트
        setCvList((prevList) =>
          prevList.map((cv) =>
            cv.recruitCvNo === cvNo ? { ...cv, isDownloaded: true } : cv
          )
        );
        setFilteredList((prevList) =>
          prevList.map((cv) =>
            cv.recruitCvNo === cvNo ? { ...cv, isDownloaded: true } : cv
          )
        );
      })
      .catch((err) => console.error("다운로드 실패", err));
  };

  const handleBulkDownload = () => {
    if (selectedCvNos.length === 0) {
      alert("선택된 이력서가 없습니다.");
      return;
    }
    selectedCvNos.forEach((cvNo) => {
      const cv = cvList.find((item) => item.recruitCvNo === cvNo);
      if (cv) {
        handleDownload(cv.recruitCvNo, cv.recruitCvPdfTitle);
      }
    });
  };
  const handleCancel = () => {
    setSelectedCvNos([]); // 체크박스 선택 초기화
  };
  const isAllSelected =
    selectedCvNos.length > 0 && selectedCvNos.length === filteredList.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // 전체 선택
      const allNos = filteredList.map((cv) => cv.recruitCvNo);
      setSelectedCvNos(allNos);
    } else {
      // 전체 해제
      setSelectedCvNos([]);
    }
  };

  return (
    <main className="container">
      <SectionHeader title="이력서 목록 조회" />

      {/* 필터 영역 */}
      <div className="cv-filter-area">
        <div className="cv-filter-top">
          <div className="cv-filter-left">
            <select
              className="cv-filter"
              value={selectedEdu}
              onChange={(e) => setSelectedEdu(e.target.value)}
            >
              <option value="">학력 선택</option>
              <option value="고졸">고졸</option>
              <option value="전문학사">전문학사</option>
              <option value="학사">학사</option>
              <option value="석사">석사</option>
              <option value="박사">박사</option>
            </select>

            <select
              className="cv-filter"
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
            >
              <option value="">경력 선택</option>
              <option value="신입">신입</option>
              <option value="1-3">경력(1~3년)</option>
              <option value="4-6">경력(4~6년)</option>
              <option value="7-9">경력(7~9년)</option>
              <option value="10-15">경력(10~15년)</option>
              <option value="16-20">경력(16~20년)</option>
              <option value="21+">경력(21년 이상)</option>
            </select>
          </div>

          <div className="cv-filter-right">
            <button className="btn-apply" onClick={handleFilter}>
              이력서 목록 분류
            </button>
          </div>
        </div>

        <div className="cv-filter-bottom">
          <div className="cv-filter-bottom-right">
            <button
              className="btn-select"
              onClick={() => setShowCheckbox(!showCheckbox)}
            >
              선택하기
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      {filteredList.length === 0 ? (
        <p style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          해당하는 이력서가 없습니다.
        </p>
      ) : (
        <table className="cv-table">
          <thead>
            <tr>
              {showCheckbox && (
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
              <th>다운로드</th>
              <th>저장 여부</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.map((cv) => (
              <tr key={cv.recruitCvNo}>
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      name="cvSelect"
                      value={cv.recruitCvNo}
                      className="cv-checkbox"
                      checked={selectedCvNos.includes(cv.recruitCvNo)}
                      onChange={() => handleCheckboxChange(cv.recruitCvNo)}
                    />
                  </td>
                )}
                <td>{cv.recruitCvNo}</td>
                <td>{cv.recruitCvPdfTitle}</td>
                <td>{cv.date}</td>
                <td>
                  <button
                    className="btn-download"
                    onClick={() =>
                      handleDownload(cv.recruitCvNo, cv.recruitCvPdfTitle)
                    }
                  >
                    다운로드
                  </button>
                </td>
                <td>{cv.isDownloaded ? "Y" : "N"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 페이징 */}
      <div className="pagination">
        <button>{"<<"}</button>
        <button>{"<"}</button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button key={page}>{page}</button>
        ))}
        <button>{">"}</button>
        <button>{">>"}</button>
      </div>

      {/* 하단 버튼 */}
      <div className="cv-bottom-actions">
        <button className="btn-cancel" onClick={handleCancel}>
          취소하기
        </button>
        <button className="btn-delete">이력서 삭제하기</button>
        {showCheckbox && (
          <button className="btn-download" onClick={handleBulkDownload}>
            선택한 이력서 일괄 다운로드
          </button>
        )}
      </div>
    </main>
  );
};

export default CorpCvListPage;
