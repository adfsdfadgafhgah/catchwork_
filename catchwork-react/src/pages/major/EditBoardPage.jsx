// // 더미용 코드!!
// import { useRef, useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Editor } from "@toast-ui/react-editor";
// import "@toast-ui/editor/dist/toastui-editor.css";
// import SectionHeader from "../../components/common/SectionHeader";
// import "./WriteBoardPage.css"; // 재사용
// import ThumbnailUploader from "../../components/common/ThumbnailUploader";
// import { dummyBoards } from "./BoardDetailPage";

// export default function EditBoardPage() {
//   const { boardNo } = useParams();
//   const navigate = useNavigate();
//   const editorRef = useRef();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState(null);

//   // 기존 글 불러오기 (더미에서)
//   useEffect(() => {
//     const found = dummyBoards.find((b) => b.boardNo === parseInt(boardNo));
//     if (found) {
//       setTitle(found.boardTitle);
//       setContent(found.boardContent);
//       setThumbnailUrl(found.boardThumbnailUrl || null);

//       const editorInstance = editorRef.current?.getInstance();
//       if (editorInstance) {
//         editorInstance.setMarkdown(found.boardContent); // ✅ 본문 내용 넣기
//       }
//     }
//   }, [boardNo]);

//   const handleThumbnailUpload = async (file) => {
//     const dummyImageUrl = URL.createObjectURL(file);
//     setThumbnailUrl(dummyImageUrl);
//   };

//   const handleRemoveThumbnail = () => {
//     setThumbnailUrl(null);
//   };

//   const handleUpdate = () => {
//     const updatedContent = editorRef.current.getInstance().getMarkdown();
//     console.log("✅ 수정된 제목:", title);
//     console.log("✅ 수정된 내용:", updatedContent);
//     console.log("✅ 썸네일 URL:", thumbnailUrl);
//     alert("수정 완료! (더미 환경이라 저장은 안 됩니다)");
//     navigate(`/board/${boardNo}`);
//   };

//   const handleCancel = () => {
//     navigate(`/board/${boardNo}`);
//   };

//   return (
//     <div className="write-wrap">
//       <SectionHeader title="게시글 수정" />
//       <input
//         type="text"
//         className="write-input-title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <div className="write-editor">
//         <Editor
//           ref={editorRef}
//           height="500px"
//           initialEditType="markdown"
//           previewStyle="vertical"
//           initialValue={content}
//           placeholder="내용을 입력해주세요"
//           useCommandShortcut={true}
//           hooks={{
//             addImageBlobHook: async (blob, callback) => {
//               const dummyImageUrl = URL.createObjectURL(blob);
//               callback(dummyImageUrl, "업로드된 이미지");
//             },
//           }}
//         />
//       </div>

//       <ThumbnailUploader
//         thumbnailUrl={thumbnailUrl}
//         onUpload={handleThumbnailUpload}
//         onRemove={handleRemoveThumbnail}
//       />

//       <div className="write-btn-area">
//         <button className="write-btn-cancel" onClick={handleCancel}>
//           취소하기
//         </button>
//         <button className="write-btn-submit" onClick={handleUpdate}>
//           수정하기
//         </button>
//       </div>
//     </div>
//   );
// }
//---------------------------------------------------------
// 서버 구현할 때 주석 풀고 쓸 코드!!!

import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import SectionHeader from "../../components/common/SectionHeader";
import "./WriteBoardPage.css"; // 재사용 가능
import ThumbnailUploader from "../../components/common/ThumbnailUploader";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";

export default function EditBoardPage() {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // initialValue용
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const { loginMember, setLoginMember } = useLoginMember();

  // 로그인 정보 없으면 세팅 시도
  useEffect(() => {
    if (!loginMember?.memNo) {
      setLoginMember();
    }
  }, []);

  // 기존 게시글 불러오기
  useEffect(() => {
    if (!loginMember?.memNo) return; // 로그인 정보 없으면 대기

    const fetchBoard = async () => {
      try {
        const resp = await axiosApi.get(`/board/detail/${boardNo}`, {
          params: { memNo: loginMember.memNo },
        });
        const data = resp.data;
        setTitle(data.boardTitle);
        setThumbnailUrl(data.boardThumbnailUrl || null);
        editorRef.current.getInstance().setMarkdown(data.boardContent);
        // setLoading(false);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글을 불러오지 못했습니다.");
        navigate("/board");
      }
    };
    fetchBoard();
  }, [boardNo, loginMember]);

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
    const content = editorRef.current.getInstance().getMarkdown();

    try {
      const resp = await axiosApi.put(`/board/edit/${boardNo}`, {
        boardTitle: title,
        boardContent: content,
        boardThumbnailUrl: thumbnailUrl,
        memNo: loginMember.memNo,
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

  const handleCancel = () => {
    navigate(`/board/${boardNo}`);
  };

  return (
    <div className="write-wrap">
      <SectionHeader title="게시글 수정" />
      <input
        type="text"
        className="write-input-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="write-editor">
        <Editor
          ref={editorRef}
          height="500px"
          initialEditType="markdown"
          previewStyle="vertical"
          initialValue={content}
          placeholder="내용을 입력해주세요"
          useCommandShortcut={true}
          hooks={{
            addImageBlobHook: async (blob, callback) => {
              const formData = new FormData();
              formData.append("image", blob);
              try {
                const resp = await axiosApi.post("/board/image", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
                callback(resp.data.url, "업로드된 이미지");
              } catch {
                alert("이미지 업로드 실패");
              }
            },
          }}
        />
      </div>

      <ThumbnailUploader
        thumbnailUrl={thumbnailUrl}
        onUpload={handleThumbnailUpload}
        onRemove={handleRemoveThumbnail}
      />

      <div className="write-btn-area">
        <button className="write-btn-cancel" onClick={handleCancel}>
          취소하기
        </button>
        <button className="write-btn-submit" onClick={handleUpdate}>
          수정하기
        </button>
      </div>
    </div>
  );
}
