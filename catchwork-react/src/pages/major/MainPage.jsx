import React from 'react';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <section className="section">
        <h2 className="section-title">맞춤형 채용공고</h2>
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div className="post-card" key={i}>
              <div className="card-header">잡담</div>
              <h3 className="card-title">오늘 날씨 미쳤다.. 진짜 너무 덥네</h3>
              <div className="card-footer">
                <span>좋아요 23</span>
                <span>댓글 4</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">인기 채용공고</h2>
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div className="post-card" key={i}>
              <div className="card-header">자소서</div>
              <h3 className="card-title">자소서 이 문장 어때요?</h3>
              <div className="card-footer">
                <span>좋아요 18</span>
                <span>댓글 2</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">최신 채용공고</h2>
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div className="post-card" key={i}>
              <div className="card-header">면접</div>
              <h3 className="card-title">오늘 면접 후기 남깁니다</h3>
              <div className="card-footer">
                <span>좋아요 9</span>
                <span>댓글 1</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">인기 기업정보</h2>
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div className="post-card" key={i}>
              <div className="card-header">면접</div>
              <h3 className="card-title">오늘 면접 후기 남깁니다</h3>
              <div className="card-footer">
                <span>좋아요 9</span>
                <span>댓글 1</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="section">
        <h2 className="section-title">인기 후기글</h2>
        <div className="card-grid">
          {[...Array(4)].map((_, i) => (
            <div className="post-card" key={i}>
              <div className="card-header">면접</div>
              <h3 className="card-title">오늘 면접 후기 남깁니다</h3>
              <div className="card-footer">
                <span>좋아요 9</span>
                <span>댓글 1</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
