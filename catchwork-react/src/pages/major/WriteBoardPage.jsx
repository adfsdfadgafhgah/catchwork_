import { useRef, useState, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import SectionHeader from "../../components/common/SectionHeader";
import "./WriteBoardPage.css";
import { useNavigate } from "react-router-dom";
import ThumbnailUploader from "../../components/common/ThumbnailUploader";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";

export default function WriteBoardPage() {
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const navigate = useNavigate();
  const { loginMember, setLoginMember } = useLoginMember();

  useEffect(() => {
    if (!loginMember?.memNo) {
      setLoginMember(); // 로그인 상태 미존재 시 초기화
    }
  }, []);

  // Toast UI Editor 로딩 후 placeholder 깨짐 보정
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      // 마운트 이후 탭 전환 트릭
      editorInstance.changeMode("wysiwyg", true);
      editorInstance.changeMode("markdown", true);
    }
  }, []);

  // 썸네일 업로드 핸들러
  const handleThumbnailUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await axiosApi.post("/board/thumbnail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setThumbnailUrl(resp.data.url);
      setThumbnailFile(file);
    } catch (err) {
      alert("썸네일 업로드 실패");
    }
  };

  // 썸네일 삭제
  const handleRemoveThumbnail = () => {
    setThumbnailUrl("");
  };

  // 글 등록 버튼 클릭 시
  const handleSubmit = async () => {
    if (!loginMember?.memNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    const contentMarkdown = editorRef.current.getInstance().getMarkdown();

    try {
      const resp = await axiosApi.post("/board/write", {
        boardTitle: title,
        boardContent: contentMarkdown,
        boardThumbnailUrl: thumbnailUrl,
        memNo: loginMember.memNo,
      });

      // 서버에서 boardNo 반환 받았다고 가정
      const newBoardNo = resp.data.boardNo;
      alert("게시글 등록 완료!");
      navigate(`/board/${newBoardNo}`);
    } catch (err) {
      console.error("등록 실패:", err);
      alert("게시글 등록 중 오류 발생");
    }
  };

  const handleCancel = () => {
    navigate("/board"); // 또는 "/board/list" 등 너의 목록 페이지 경로에 맞게
  };

  return (
    <div className="write-wrap">
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담 작성" />
      <input
        type="text"
        className="write-input-title"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toast UI 에디터 */}
      <div className="write-editor">
        <Editor
          ref={editorRef}
          height="500px"
          initialEditType="markdown"
          previewStyle="vertical"
          initialValue=" "
          placeholder="내용을 입력해주세요"
          useCommandShortcut={true}
          hooks={{
            // 이미지 업로드 처리
            addImageBlobHook: async (blob, callback) => {
              const formData = new FormData();
              formData.append("image", blob);
              try {
                const resp = await axiosApi.post("/board/image", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
                callback(resp.data.url, "업로드된 이미지");
              } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 중 오류가 발생했습니다.");
              }
            },
          }}
        />
      </div>

      {/* 썸네일 업로더 */}
      <ThumbnailUploader
        thumbnailUrl={thumbnailUrl}
        onUpload={handleThumbnailUpload}
        onRemove={handleRemoveThumbnail}
      />
      <div className="write-btn-area">
        <button className="write-btn-cancel" onClick={handleCancel}>
          <i className="fa-solid fa-xmark"></i> 취소하기
        </button>
        <button className="write-btn-submit" onClick={handleSubmit}>
          <i className="fa-regular fa-pen-to-square"></i> 작성하기
        </button>
      </div>
    </div>
  );
}
