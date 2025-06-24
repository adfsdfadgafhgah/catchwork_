import React from "react";
import { useParams } from "react-router-dom";
import "./SupportDetailPage.css";

const dummyData = [
  {
    id: 10,
    title: "아버지",
    category: "카테고리",
    content: "풀어주세요ㅠㅠ",
    date: "2025-01-09",
    answer: "ㄴㄴ",
    answerDate: "2025-08-09"
  },
  {
    id: 9,
    title: "왜 안되죠?",
    category: "카스테라",
    content: "지금도 안됩니다",
    date: "2025-01-09",
    answer: "되는데요?",
    answerDate: null
  },
  {
    id: 8,
    title: "왜 안되죠?",
    category: "서비스 이용 문의",
    content: "지금도 안됩니다",
    date: "2025-1-09",
    answer: null,
    answerDate: null
  },
  // 7~1번까지 답변 없음 처리
  {
    id: 7,
    title: "깡데이터 넣었어요",
    category: "개발 문의",
    content: "살려주세요",
    date: "2025-05-08",
    answer: null,
    answerDate: null
  },
  {
    id: 6,
    title: "지금은 깡데이터임다",
    category: "코드 문의",
    content: "나중에는 바꿔야겠죠?",
    date: "2025-04-08",
    answer: null,
    answerDate: null
  },
  {
    id: 5,
    title: "키키",
    category: "안녕하세요?",
    content: "키키",
    date: "2025-03-08",
    answer: null,
    answerDate: null
  },
  {
    id: 4,
    title: "나중에 바꿀거",
    category: "기타 문의",
    content: "바꿔야함",
    date: "2025-07-08",
    answer: null,
    answerDate: null
  },
  {
    id: 3,
    title: "문의하기",
    category: "의의제기 문의",
    content: "문의 입니다",
    date: "2025-08-08",
    answer: null,
    answerDate: null
  },
  {
    id: 2,
    title: "죽어라",
    category: "서비스 이용 문의",
    content: "죽어라",
    date: "2025-11-08",
    answer: null,
    answerDate: null
  },
  {
    id: 1,
    title: "살아라",
    category: "정지 문의",
    content: "살아라",
    date: "2025-01-09",
    answer: null,
    answerDate: null
  }
];

const SupportDetailPage = () => {
  const { id } = useParams();
  const support = dummyData.find((item) => String(item.id) === id);

  if (!support) return <div className="not-found">해당 문의를 찾을 수 없습니다.</div>;

  return (
    <div className="support-detail-container">
      <h2 className="page-title">문의 상세</h2>

      {/* 제목 표시 */}
      <section className="form-group">
        <p className="readonly-text">제목 :{support.title}</p>
      </section>

      {/* 카테고리 + 작성일 한 줄로 표시 */}
      <div className="meta-row">
        <span className="category">카테고리 : {support.category}</span>
        <span className="date">{support.date}</span>
      </div>

      {/* 내용 */}
      <section className="form-group">
        <textarea readOnly value={support.content} rows={8} />
      </section>

      {/* 답변 */}
      <h2 className="page-title" style={{ marginTop: "48px" }}>문의 답변</h2>
      <span className="date">{support.date}</span>

      {support.answer ? (
        <>
          {/* 답변일과 함께 표시 */}
          <div className="meta-row">
            <span className="category"></span>
            <span className="date">{support.answerDate}</span>
          </div>
          <section className="form-group">
            <label> </label>
            <textarea readOnly value={support.answer} rows={8} />
          </section>
        </>
      ) : (
        <section className="form-group">
          <p className="no-answer-message">답변이 아직 오지 않았습니다.</p>
        </section>
      )}
    </div>
  );
};

export default SupportDetailPage;