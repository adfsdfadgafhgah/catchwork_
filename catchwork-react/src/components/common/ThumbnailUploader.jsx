import { useRef } from "react";
import "./ThumbnailUploader.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ThumbnailUploader({
  thumbnailUrl,
  onUpload,
  onRemove,
}) {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="thumbnail-uploader">
      <label className="label">썸네일 등록</label>
      <p className="desc">썸네일은 리스트에 80×80으로 노출됩니다.</p>

      <div className="upload-box" onClick={handleClick}>
        {thumbnailUrl ? (
          <>
            <img
              src={`${BASE_URL}/${thumbnailUrl}`}
              alt="썸네일 미리보기"
              className="thumbnail-preview"
            />
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ✕
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            <span className="plus">＋</span>
            <p>이미지를 등록해주세요 (최대 2MB)</p>
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
