// FloatButton.js (아래 전체 코드로 교체)
// 이전의 Link 관련 수정사항도 모두 포함된 최종 버전입니다.

import "./FloatButton.css";
import { Link } from "react-router-dom";

export default function FloatButton({ buttons = [] }) {
  return (
    <div className="float-button-container">
      {buttons.map((btn, index) =>
        btn.to ? (
          // Link 렌더링
          <Link
            key={index}
            to={btn.to}
            className={`float-btn ${btn.className || ""}`}
          >
            {btn.icon &&
              (btn.iconType === "material" ? (
                <span className="material-symbols-outlined">{btn.icon}</span>
              ) : (
                <i className={btn.icon}></i>
              ))}
            {btn.label}
          </Link>
        ) : (
          // Button 렌더링
          <button
            key={index}
            className={`float-btn ${btn.className || ""}`}
            onClick={btn.onClick}
            disabled={btn.disabled || false}
            type={btn.type || "button"} // type 속성 적용, 기본값은 'button'
          >
            {btn.icon &&
              (btn.iconType === "material" ? (
                <span className="material-symbols-outlined">{btn.icon}</span>
              ) : (
                <i className={btn.icon}></i>
              ))}
            {btn.label}
          </button>
        )
      )}
    </div>
  );
}
