import "./FloatButton.css";

export default function FloatButton({ buttons = [] }) {
  return (
    <div className="float-button-container">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`float-btn ${btn.className || ""}`}
          onClick={btn.onClick}
        >
          {/* iconType이 material이면 <span>으로, 아니면 <i>로 렌더링 */}
          {btn.icon &&
            (btn.iconType === "material" ? (
              <span className="material-symbols-outlined">{btn.icon}</span>
            ) : (
              <i className={btn.icon}></i>
            ))}{" "}
          {btn.label}
        </button>
      ))}
    </div>
  );
}
