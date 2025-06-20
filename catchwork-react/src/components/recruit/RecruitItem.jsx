import React from "react";
import "./RecruitItem.css";

const RecruitItem = ({ data }) => {
  const {
    title,
    company,
    category,
    field,
    date,
    views,
    comments,
    likes,
    isNew,
  } = data;

  return (
    <div className="recruit-item">
      <div className="recruit-item-header">
        <div className="company-logo">
          <img src="/api/placeholder/60/60" alt="Company Logo" />
        </div>
        {isNew && <span className="new-badge">New</span>}
      </div>

      <div className="recruit-item-content">
        <h3 className="recruit-title">{title}</h3>
        <p className="company-name">{company}</p>
        <div className="recruit-meta">
          <span className="category">{category}</span>
          <span className="field">{field}</span>
          <span className="date">-{date}</span>
        </div>
      </div>

      <div className="recruit-item-footer">
        <div className="stats">
          <span className="stat-item">
            <i className="icon-eye"></i>
            {views}
          </span>
          <span className="stat-item">
            <i className="icon-comment"></i>
            {comments}
          </span>
          <span className="stat-item">
            <i className="icon-heart"></i>
            {likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecruitItem;
