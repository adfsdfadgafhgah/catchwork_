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
          {btn.icon && <i className={btn.icon}></i>} {btn.label}
        </button>
      ))}
    </div>
  );
}
