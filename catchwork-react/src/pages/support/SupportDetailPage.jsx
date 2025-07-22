import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SupportDetailPage.css";
import { axiosApi } from "../../api/axiosAPI";

const SupportDetailPage = () => {
  const { id } = useParams();
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupportDetail = async () => {
      try {
        const response = await axiosApi.get(`/support/detail/${id}`);
        setSupport(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "데이터를 가져오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportDetail();
  }, [id]);

  if (loading) return <p className="loading-message">로딩 중...</p>;
  if (error) return <p className="error-message">오류: {error}</p>;
  if (!support) return <div className="not-found">해당 문의를 찾을 수 없습니다.</div>;

  return (
    <div className="support-detail-container">
      <h2 className="page-title">문의 상세</h2>

      <section className="form-group">
        <p className="readonly-text">제목 : {support.supportTitle}</p>
      </section>

      <div className="meta-row">
        <span className="category">카테고리 : {support.supportCategoryName}</span>
      </div>

      <section className="form-group">
        <textarea readOnly value={support.supportContent} rows={8} />
      </section>

      <h2 className="page-title" style={{ marginTop: "48px" }}>문의 답변</h2>

      {support.supportAnswer ? (
        <section className="form-group">
          <textarea readOnly value={support.supportAnswer} rows={8} />
        </section>
      ) : (
        <section className="form-group">
          <p className="no-answer-message">답변이 아직 오지 않았습니다.</p>
        </section>
      )}
    </div>
  );
};

export default SupportDetailPage;
