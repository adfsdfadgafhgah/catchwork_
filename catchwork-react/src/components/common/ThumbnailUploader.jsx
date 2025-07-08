import { useRef, useState, useEffect, useImperativeHandle } from "react";
import "./ThumbnailUploader.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const boardImgUrl = import.meta.env.VITE_FILE_BOARD_IMG_URL;

export default function ThumbnailUploader({ thumbnailUrl, ref }) {
  const inputRef = useRef();
  // 썸네일 미리보기
  const [previewSrc, setPreviewSrc] = useState("");
  // 썸네일 이미지 파일
  const [imgFile, setImgFile] = useState(null);

  // 미리보기 이미지 정리
  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  // 썸네일 이미지 업로드 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl);
      setImgFile(file);
    }
  };

  // 썸네일 업로드 버튼 클릭 시
  const handleClick = () => {
    inputRef.current.click();
  };

  // 부모에서 ref로 접근 가능한 기능 정의
  useImperativeHandle(ref, () => ({
    getImageFile: () => imgFile,
    clearImage: () => {
      setImgFile(null);
      setPreviewSrc("");
    },
  }));

  return (
    <div className="thumbnail-uploader">
      <label className="label">썸네일 등록</label>
      <p className="desc">썸네일은 리스트에 80×80으로 노출됩니다.</p>

      <div className="upload-box" onClick={handleClick}>
        {thumbnailUrl || previewSrc ? (
          <>
            <img
              src={thumbnailUrl ? `${boardImgUrl}${thumbnailUrl}` : previewSrc}
              alt="썸네일 미리보기"
              className="thumbnail-preview"
            />
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewSrc("");
                setImgFile(null);
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
