import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import SectionHeader from "../../components/common/SectionHeader";
import styles from "./WriteBoardPage.module.css"; // 재사용 가능
import ThumbnailUploader from "../../components/common/ThumbnailUploader";
import { axiosApi } from "../../api/axiosAPI";

export default function EditBoardPage() {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // initialValue용
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const thumbnailUploaderRef = useRef();
  const { memNo } = useOutletContext();
  const [isFormValid, setIsFormValid] = useState(false);

  // 기존 게시글 불러오기
  useEffect(() => {
    // memNo가 undefined (아직 로딩 중)이거나 null (비로그인)일 경우 대기
    if (memNo === undefined) {
      return;
    }

    const fetchBoard = async () => {
      // 게시글 수정은 로그인된 사용자만 가능하므로, memNo가 없으면 리다이렉트
      if (!memNo) {
        alert("로그인이 필요합니다.");
        navigate("/signin");
        return;
      }

      try {
        const resp = await axiosApi.get(`/board/detail/${boardNo}`, {
          params: { memNo: memNo }, // memNo prop 사용
        });
        const data = resp.data;
        setTitle(data.boardTitle);
        setThumbnailUrl(data.boardThumbnailUrl || null);
        // Editor 인스턴스가 준비된 후에만 setMarkdown 호출
        if (editorRef.current) {
          editorRef.current.getInstance().setMarkdown(data.boardContent);
        } else {
          // 에디터가 아직 마운트되지 않았다면 content 상태에 저장하여 initialValue로 사용
          setContent(data.boardContent);
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글을 불러오지 못했습니다.");
        navigate("/board");
      }
    };
    fetchBoard();
  }, [boardNo, memNo, navigate]); // loginMember 대신 memNo를 의존성 배열에 추가

  // Toast UI Editor 로딩 후 placeholder 깨짐 보정 (기존과 동일)
  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      editorInstance.changeMode("wysiwyg", true);
      editorInstance.changeMode("markdown", true);
    }
  }, []);

  // 썸네일 등록
  const handleThumbnailUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const resp = await axiosApi.post("/board/thumbnail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setThumbnailUrl(resp.data.url);
    } catch (err) {
      console.error("썸네일 업로드 실패:", err);
      alert("썸네일 업로드 실패");
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailUrl(null);
  };

  // 수정 요청
  const handleUpdate = async () => {
    // memNo prop을 사용하여 로그인 여부를 다시 확인
    if (!memNo) {
      alert("로그인이 필요합니다.");
      return;
    }
    const content = editorRef.current.getInstance().getMarkdown();

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
    if (thumbnailUploaderRef.current.isDelete()) {
      formData.append("isDelete", true);
    }

    try {
      const resp = await axiosApi.put(`/board/edit/${boardNo}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resp.status === 200) {
        alert("수정 완료!");
        navigate(`/board/${boardNo}`);
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  // 취소 버튼 클릭 시
  const handleCancel = () => {
    navigate(`/board/${boardNo}`);
  };

  return (
    <div className={styles.writeWrap}>
      <SectionHeader title="게시글 수정" />
      <input
        type="text"
        className={styles.writeInputTitle}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.writeEditor}>
        <Editor
          ref={editorRef}
          height="500px"
          initialEditType="markdown"
          previewStyle="vertical"
          initialValue={content}
          placeholder="내용을 입력해주세요"
          useCommandShortcut={true}
          onChange={() => {
            const contentMarkdown = editorRef.current
              .getInstance()
              .getMarkdown();
            setIsFormValid(
              title.trim() !== "" && contentMarkdown.trim() !== ""
            );
          }}
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
      </div>

      <ThumbnailUploader
        thumbnailUrl={thumbnailUrl}
        ref={thumbnailUploaderRef}
      />

      <div className={styles.writeBtnArea}>
        <button className={styles.writeBtnCancel} onClick={handleCancel}>
          취소하기
        </button>
        <button
          className={styles.writeBtnSubmit}
          onClick={handleUpdate}
          disabled={!isFormValid}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}
