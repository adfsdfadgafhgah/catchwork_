//----------------------------------------------------------------------
// 추후 서버 구현 후 쓸 코드

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCss from "./BoardDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import CommentList from "../../components/board/CommentList";
import { formatTimeAgo } from "../../components/common/formatTimeAgo";
import ReportModalPage from "../support/ReportModalPage";
import { Viewer } from "@toast-ui/react-editor"; // Toast UI Viewer 추가
import useLoginMember from "../../stores/loginMember";

export default function BoardDetailPage() {
  const { boardNo } = useParams();
  const [board, setBoard] = useState(null);
  const { loginMember, setLoginMember } = useLoginMember();
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const navigate = useNavigate(); // ← 페이지 이동을 위해 추가
  const [showReportModal, setShowReportModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const isWriter = loginMember?.memNo && loginMember.memNo === board?.memNo;

  // loginMember 가져오기
  useEffect(() => {
    if (!loginMember?.memNo) {
      const fetchLoginMember = async () => {
        await setLoginMember(); // loginMember를 zustand에 갱신
      };
      fetchLoginMember();
    }
  }, []);

  // 게시글 상세 조회 API
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/board/detail/${boardNo}`, {
          params: { memNo: loginMember?.memNo },
        });
        const data = resp.data;
        setBoard(data);
        setLiked(data.likedByCurrentUser); // 서버에서 내려줘야 함
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("상세 조회 실패:", err);
      }
    };

    fetchDetail();
  }, [boardNo, loginMember?.memNo]);

  // 게시글 조회수 증가
  useEffect(() => {
    const key = `viewed_${boardNo}`;
    const lastViewed = localStorage.getItem(key);
    const now = new Date();

    if (
      !lastViewed ||
      new Date(lastViewed).toDateString() !== now.toDateString()
    ) {
      localStorage.setItem(key, now.toISOString()); // react18버전 때문에 조회수 2증가 방지
      axiosApi
        .get(`/board/readCount/${boardNo}`)
        .then(() => {
          localStorage.setItem(key, now.toISOString());
          console.log("📈 조회수 증가");
        })
        .catch((err) => console.error("조회수 증가 실패:", err));
    }
  }, [boardNo]);

  // 수정 페이지로!
  const handleEdit = () => {
    navigate(`/board/edit/${boardNo}`);
  };

  // 게시글 삭제 함수
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/board/delete/${boardNo}`, {
        data: { memNo: loginMember.memNo },
      });

      if (resp.status === 200) {
        alert("삭제되었습니다.");
        navigate("/board"); // 삭제 후 목록으로 이동
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  // 좋아요 토글 함수 추가
  const toggleLike = async () => {
    if (!loginMember) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: loginMember.memNo,
      });

      if (resp.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  // 신고하기
  const handleReportClick = () => {
    if (!loginMember || !loginMember.memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin"); // 로그인 페이지로 이동
      return;
    }

    setShowReportModal(true); // 로그인한 사용자만 신고 가능
  };

  // 신고하기 모달 취소하기 버튼
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  if (!board) return <h2>Loading...</h2>;

  // 오류 날 시 찍을 콘솔
  // console.log("🧪 board:", board);
  // console.log("🧪 loginMember:", loginMember);
  // console.log("🧪 board.member.memNo:", board?.memNo);
  // console.log("🧪 loginMember.memNo:", loginMember?.memNo);
  // console.log("🧪 작성자 여부:", loginMember?.memNo === board?.memNo);

  return (
    <>
      <div className={BoardCss.detailWrapper}>
        {/* 섹션 헤더 */}
        <SectionHeader title="취준진담" />

        {/* 제목 + 수정/삭제 */}
        <div className={BoardCss.headerRow}>
          <h1 className={BoardCss.title}>{board.boardTitle}</h1>

          {isWriter && (
            <div className={BoardCss.actionButtons}>
              <button className={BoardCss.actionBtn} onClick={handleEdit}>
                <i className="fa-regular fa-pen-to-square"></i> 수정하기
              </button>
              <button className={BoardCss.actionBtn} onClick={handleDelete}>
                <i className="fa-regular fa-trash-can"></i> 삭제하기
              </button>
            </div>
          )}
        </div>

        {/* 작성자 정보 + 메타 정보 */}
        <div className={BoardCss.metaRow}>
          <div className={BoardCss.writerInfo}>
            <img
              src={
                board?.memProfilePath
                  ? `http://localhost:8080/${board.member.memProfilePath}`
                  : "/default-profile.png"
              }
              alt="프로필"
            />
            <span>{board?.memNickname}</span>
            <span>{formatTimeAgo(board.boardWriteDate)}</span>
          </div>
          <div className={BoardCss.metaInfo}>
            <i className="fa-regular fa-eye"></i> {board.boardReadCount}{" "}
            &nbsp;&nbsp;
            <i
              className={`fa-heart ${
                liked ? "fa-solid liked-heart" : "fa-regular"
              }`}
              onClick={toggleLike}
              style={{
                cursor: "pointer",
                color: liked ? "var(--main-color)" : "gray",
              }}
            />{" "}
            {likeCount} &nbsp;&nbsp;
            {/* 신고하기 버튼 조건 렌더링 */}
            {!isWriter && (
              <button
                className={BoardCss.actionBtn}
                onClick={handleReportClick}
              >
                <span
                  className={`material-symbols-outlined ${BoardCss.iconSmall}`}
                >
                  siren
                </span>
                신고하기
              </button>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className={BoardCss.contentBox}>
          {/* markdown을 HTML로 렌더링 */}
          <Viewer initialValue={board.boardContent} />
        </div>
      </div>
      {/* 댓글 컴포넌트 */}
      <CommentList boardNo={board.boardNo} loginMember={loginMember} />

      {/* 신고하기 모달 */}
      {showReportModal && (
        <ReportModalPage
          targetNo={boardNo}
          targetType="board"
          onClose={handleCloseReport}
          memberNo={loginMember.memNo}
        />
        
      )}
    </>
  );
}

// // 날짜 형식 바꾸기
// import dayjs from "dayjs";
// <span>{dayjs(board.boardWriteDate).format("YYYY-MM-DD")}</span>

// board가 null일 때 board.boardNo를 사용할 수 없을 때 쓸 조건부 렌더링
// {board && <CommentList boardNo={board.boardNo} loginUser={loginUser} />}
