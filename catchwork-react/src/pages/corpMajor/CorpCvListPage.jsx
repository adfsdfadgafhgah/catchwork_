import { useState, useEffect } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import Pagination from "../../components/common/Pagination";
import { axiosApi } from "../../api/axiosAPI";
import "./CorpCVListPage.css";
import { getCareerRange } from "../../hooks/getCareerRange";

const CorpCVListPage = () => {
  const [cvList, setCVList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedEdu, setSelectedEdu] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [selectedCVNos, setSelectedCVNos] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; //한페이지에 보여지는 이력서 갯수

  useEffect(() => {
    fetchCVList(); //처음 페이지 진입시 전체 목록 호출
  }, []);

  const fetchCVList = async () => {
    try {
      const res = await axiosApi.get("/corpcv/list");
      const formatted = res.data.map((cv) => ({
        ...cv,
        isDownloaded: cv.recruitCVCheckFl === "Y",
        date: cv.recruitCVDate || "",
      }));
      setCVList(formatted);
      setFilteredList(formatted);
    } catch (err) {
      console.error("이력서 전체 목록 불러오기 실패", err);
    }
  };

  const handleFilter = async () => {
    try {
      const { careerMin, careerMax } = getCareerRange(selectedExp);

      const params = {};
      // 학력 필터는 선택된 경우만 추가
      if (selectedEdu !== "") {
        params.recruitCVEdu = selectedEdu;
      }

      if (careerMin !== null && careerMax !== null) {
        params.careerMin = careerMin;
        params.careerMax = careerMax;
      }

      const res = await axiosApi.get("/corpcv/filter", { params });
      const rawList = Array.isArray(res.data) ? res.data : []; // ✅ 핵심
      const formatted = res.data.map((cv) => ({
        ...cv,
        isDownloaded: cv.recruitCVCheckFl === "Y",
        date: cv.recruitCVDate || "",
      }));
      setCVList(formatted);
      setFilteredList(formatted);
      setCurrentPage(1);
      setSelectedCVNos([]);
    } catch (err) {
      console.error("필터링된 이력서 불러오기 실패", err);
      setCVList([]); // 실패 시도라도 초기화
      alert("필터링 된 이력서 목록 불러오기에 실패했습니다.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const handleCheckboxChange = (cvNo) => {
    setSelectedCVNos((prev) =>
      prev.includes(cvNo) ? prev.filter((no) => no !== cvNo) : [...prev, cvNo]
    );
  };

  const handleDownload = async (cvNo, cvTitle) => {
    try {
      const res = await axiosApi.get(`/corpcv/download/${cvNo}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvTitle}.pdf`;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setCVList((prevList) =>
        prevList.map((cv) =>
          cv.recruitCVNo === cvNo ? { ...cv, isDownloaded: true } : cv
        )
      );
      setFilteredList((prevList) =>
        prevList.map((cv) =>
          cv.recruitCVNo === cvNo ? { ...cv, isDownloaded: true } : cv
        )
      );
    } catch (err) {
      console.error("다운로드 실패", err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleBulkDownload = () => {
    if (selectedCVNos.length === 0) {
      alert("선택된 이력서가 없습니다.");
      return;
    }
    selectedCVNos.forEach((cvNo) => {
      const cv = filteredList.find((item) => item.recruitCVNo === cvNo);
      if (cv) {
        handleDownload(cv.recruitCVNo, cv.recruitCVPdfTitle);
      }
    });
  };

  const handleCancel = () => {
    setSelectedCVNos([]);
  };

  const isAllSelected =
    selectedCVNos.length > 0 && selectedCVNos.length === currentItems.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allNos = currentItems.map((cv) => cv.recruitCVNo);
      setSelectedCVNos(allNos);
    } else {
      setSelectedCVNos([]);
    }
  };

  const { careerMin, careerMax } = getCareerRange(selectedExp);
  return (
    <main className="container">
      <SectionHeader title="이력서 목록 조회" />

      {/* 필터 영역 */}
      <div className="cv-filter-area">
        <div className="cv-filter-top">
          <div className="cv-filter-left">
            {/* 학력 필터 */}
            <select
              className="cv-filter"
              value={selectedEdu}
              onChange={(e) => setSelectedEdu(e.target.value)}
            >
              <option value="">학력 선택</option>
              <option value="0">고졸</option>
              <option value="1">전문학사</option>
              <option value="2">학사</option>
              <option value="3">석사</option>
              <option value="4">박사</option>
            </select>

            {/* 경력 필터 */}
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
              <th style={{ width: "40px" }}>
                {showCheckbox && (
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                )}
              </th>
              <th>공고 제목</th>
              <th>제목</th>
              <th>작성일</th>
              <th>다운로드</th>
              <th>저장 여부</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((cv) => (
              <tr key={cv.recruitCVNo}>
                <td style={{ width: "40px", textAlign: "center" }}>
                  {showCheckbox && (
                    <input
                      type="checkbox"
                      value={cv.recruitCVNo}
                      checked={selectedCVNos.includes(cv.recruitCVNo)}
                      onChange={() => handleCheckboxChange(cv.recruitCVNo)}
                    />
                  )}
                </td>
                <td>{cv.recruitTitle}</td>
                <td>{cv.recruitCVPdfTitle}</td>
                <td>{cv.date}</td>
                <td>
                  <button
                    className="btn-download"
                    onClick={() =>
                      handleDownload(cv.recruitCVNo, cv.recruitCVPdfTitle)
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            setSelectedCVNos([]); //체크박스 다시 빈상태로
          }}
        />
      )}

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

export default CorpCVListPage;
