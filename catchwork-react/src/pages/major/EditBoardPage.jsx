// 더미용 코드!!
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import SectionHeader from "../../components/common/SectionHeader";
import "./WriteBoardPage.css"; // 재사용
import { dummyBoards } from "./BoardDetailPage";

export default function EditBoardPage() {
  const { boardNo } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 글 불러오기 (더미에서)
  useEffect(() => {
    const found = dummyBoards.find((b) => b.boardNo === parseInt(boardNo));
    if (found) {
      setTitle(found.boardTitle);
      setContent(found.boardContent);

      const editorInstance = editorRef.current?.getInstance();
      if (editorInstance) {
        editorInstance.setMarkdown(found.boardContent); // ✅ 직접 넣어줌!
      }
    }
  }, [boardNo]);

  // 수정 요청 (더미에서는 실제 저장은 안 됨)
  const handleUpdate = () => {
    const updatedContent = editorRef.current.getInstance().getMarkdown();
    console.log("✅ 수정된 제목:", title);
    console.log("✅ 수정된 내용:", updatedContent);
    alert("수정 완료! (더미 환경이라 저장은 안 됩니다)");
    navigate(`/board/${boardNo}`);
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
              // 더미 환경에서는 업로드 없이 대체 URL 사용
              const dummyImageUrl = URL.createObjectURL(blob);
              callback(dummyImageUrl, "업로드된 이미지");
            },
          }}
        />
      </div>
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

// 서버 구현할 때 주석 풀고 쓸 코드!!!
// import { useRef, useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Editor } from "@toast-ui/react-editor";
// import "@toast-ui/editor/dist/toastui-editor.css";
// import SectionHeader from "../../components/common/SectionHeader";
// import "./WriteBoardPage.css"; // 재사용 가능

// export default function EditBoardPage() {
//   const { boardNo } = useParams();
//   const navigate = useNavigate();
//   const editorRef = useRef();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState(""); // initialValue용

//   // 기존 글 불러오기
//   useEffect(() => {
//     const fetchBoard = async () => {
//       try {
//         const res = await axios.get(`/api/board/${boardNo}`);
//         setTitle(res.data.boardTitle);
//         setContent(res.data.boardContent); // markdown
//       } catch (err) {
//         alert("게시글 정보를 불러오지 못했습니다.");
//       }
//     };
//     fetchBoard();
//   }, [boardNo]);

//   // 수정 요청
//   const handleUpdate = async () => {
//     const contentMarkdown = editorRef.current.getInstance().getMarkdown();

//     try {
//       await axios.put(`/api/board/${boardNo}`, {
//         boardTitle: title,
//         boardContent: contentMarkdown,
//       });
//       alert("게시글 수정 완료!");
//       navigate(`/board/${boardNo}`);
//     } catch (err) {
//       alert("수정 중 오류가 발생했습니다.");
//     }
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
//               const formData = new FormData();
//               formData.append("image", blob);
//               try {
//                 const res = await axios.post("/api/board/image", formData, {
//                   headers: { "Content-Type": "multipart/form-data" },
//                 });
//                 callback(res.data.url, "업로드된 이미지");
//               } catch {
//                 alert("이미지 업로드 실패");
//               }
//             },
//           }}
//         />
//       </div>
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
