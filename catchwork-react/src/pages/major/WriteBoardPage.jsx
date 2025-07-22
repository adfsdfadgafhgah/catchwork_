import { useRef, useState, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import SectionHeader from "../../components/common/SectionHeader";
import styles from "./WriteBoardPage.module.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import ThumbnailUploader from "../../components/common/ThumbnailUploader";
import { axiosApi } from "../../api/axiosAPI";

// 각 필드별 최대 글자 수
const MAX_LENGTHS = {
  title: 50,
  content: 4000,
};

export default function WriteBoardPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { memNo } = useOutletContext();
  const [isFormValid, setIsFormValid] = useState(false);
  const thumbnailUploaderRef = useRef();

  // Toast UI Editor 로딩 후 placeholder 깨짐 보정
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      // 마운트 이후 탭 전환 트릭
      editorInstance.changeMode("wysiwyg", true);
      editorInstance.changeMode("markdown", true);
    }
  }, []);

  // title과 content state가 변경될 때마다 유효성 검사
  useEffect(() => {
    setIsFormValid(title.trim() !== "" && content.trim() !== "");
  }, [title, content]);

  // 제목 입력 핸들러 (글자 수 제한 기능 추가)
  const handleTitleChange = (e) => {
    const { value } = e.target;
    if (value.length <= MAX_LENGTHS.title) {
      setTitle(value);
    }
  };

  // 에디터 내용 변경 핸들러 (글자 수 제한 기능 추가)
  const handleEditorChange = () => {
    const editorInstance = editorRef.current.getInstance();
    let markdown = editorInstance.getMarkdown();

    if (markdown.length > MAX_LENGTHS.content) {
      // 글자 수 제한 초과 시 내용 자르기
      markdown = markdown.slice(0, MAX_LENGTHS.content);
      editorInstance.setMarkdown(markdown, true); // 두 번째 인자로 true를 주어 커서를 맨 뒤로 이동
      alert(`내용은 ${MAX_LENGTHS.content}자를 초과하여 작성할 수 없습니다.`);
    }
    setContent(markdown);
  };

  // 글 등록 버튼 클릭 시
  const handleSubmit = async () => {
    if (!memNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 최종 유효성 검사
    if (!isFormValid) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const contentMarkdown = editorRef.current.getInstance().getMarkdown();
    const formData = new FormData();
    formData.append("boardTitle", title);
    formData.append("boardContent", content);
    formData.append("memNo", memNo);
    if (thumbnailUploaderRef.current.getImageFile()) {
      formData.append(
        "thumbnailFile",
        thumbnailUploaderRef.current.getImageFile()
      );
    }

    try {
      const resp = await axiosApi.post("/board/write", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  // 취소 버튼 클릭 시
  const handleCancel = () => {
    navigate("/board"); // 또는 "/board/list" 등 너의 목록 페이지 경로에 맞게
  };

  return (
    <div className={styles.writeWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="취준진담 작성" />
      <input
        type="text"
        className={styles.writeInputTitle}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={MAX_LENGTHS.title}
      />
      <div className={styles.charCounter}>
        {title.length} / {MAX_LENGTHS.title}
      </div>

      {/* Toast UI 에디터 */}
      <div className={styles.writeEditor}>
        <Editor
          ref={editorRef}
          height="500px"
          initialEditType="markdown"
          previewStyle="vertical"
          initialValue=" "
          placeholder="내용을 입력해주세요"
          useCommandShortcut={true}
          onChange={handleEditorChange}
          hooks={{
            // 이미지 업로드 처리
            addImageBlobHook: async (blob, callback) => {
              // 에디터에 업로드한 이미지를 FormData 형식으로 변환
              const formData = new FormData();
              // 선택한 이미지가 blob 형식으로 전달되므로 FormData에 추가
              formData.append("image", blob);
              try {
                // 이미지 업로드 요청
                const resp = await axiosApi.post(
                  "/board/image-upload",
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                );

                // 이미지 업로드 성공 시 이미지 파일명 반환
                const fileName = await resp.data;
                console.log(fileName);

                // 업로드한 이미지 미리보기
                const renderUrl = `${baseUrl}board/image-print?filename=${fileName}`;
                console.log(renderUrl);
                callback(renderUrl, "업로드된 이미지");
              } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 중 오류가 발생했습니다.");
              }
            },
          }}
        />
        <div className={styles.charCounter}>
          {content.length} / {MAX_LENGTHS.content}
        </div>
      </div>

      {/* 썸네일 업로더 */}
      <ThumbnailUploader ref={thumbnailUploaderRef} />
      <div className={styles.writeBtnArea}>
        <button className={styles.writeBtnCancel} onClick={handleCancel}>
          <i className="fa-solid fa-xmark"></i> 취소하기
        </button>
        <button
          className={styles.writeBtnSubmit}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          <i className="fa-regular fa-pen-to-square"></i> 작성하기
        </button>
      </div>
    </div>
  );
}
