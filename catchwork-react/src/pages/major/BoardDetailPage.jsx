import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCss from "./BoardDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import CommentList from "../../components/board/CommentList";
import { formatTimeAgo } from "../../components/common/formatTimeAgo";
import ReportModalPage from "../support/ReportModalPage";
import { Viewer } from "@toast-ui/react-editor"; // Toast UI Viewer 추가
import defaultImg from "../../assets/icon.png";

export default function BoardDetailPage() {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const { memNo } = useOutletContext();
  const { boardNo } = useParams();
  const [board, setBoard] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const navigate = useNavigate(); // ← 페이지 이동을 위해 추가
  const [showReportModal, setShowReportModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // 작성자
  const isWriter = memNo && memNo === board?.memNo;

  // 신고하기 관련
  const [reportTargetNo, setReportTargetNo] = useState(null);
  const [reportTargetType, setReportTargetType] = useState(null);
  const [reportTargetNickname, setReportTargetNickname] = useState(null);

  // 쿠키 헬퍼 함수 정의
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // 게시글 상세 조회 API
  useEffect(() => {
    // memNo가 undefined (아직 로딩 중)일 경우 대기
    if (memNo === undefined) {
      return;
    }

    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/board/detail/${boardNo}`, {
          params: { memNo: memNo },
        });
        const data = resp.data;
        setBoard(data);
        setLiked(data.likedByCurrentUser); // 서버에서 내려줘야 함
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("상세 조회 실패:", err);
        // 게시글이 없거나 접근 권한이 없을 경우 목록으로 이동
        alert("게시글을 불러오지 못했습니다.");
        navigate("/board");
      }
    };

    fetchDetail();
  }, [boardNo, memNo, navigate]);

  // 게시글 조회수 증가
  useEffect(() => {
    const key = `viewed_${boardNo}`;
    const now = new Date();
    const today = now.toDateString();
    const lastViewed = getCookie(key);

    if (!lastViewed || new Date(lastViewed).toDateString() !== today) {
      setCookie(key, now.toISOString(), 1);
      axiosApi
        .get(`/board/readCount/${boardNo}`)
        .then(() => {
          console.log("조회수 증가");
        })
        .catch((err) => console.error("조회수 증가 실패:", err));
    } else {
      console.log("오늘 이미 조회함 (쿠키 확인)");
    }
  }, [boardNo]);

  // 수정 페이지로!
  const handleEdit = () => {
    // 수정은 로그인된 사용자만 가능하며, 자신의 게시글만 가능
    if (!memNo || memNo !== board?.memNo) {
      alert("수정 권한이 없습니다.");
      return;
    }
    navigate(`/board/edit/${boardNo}`);
  };

  // 게시글 삭제 함수
  const handleDelete = async () => {
    // 삭제는 로그인된 사용자만 가능하며, 자신의 게시글만 가능
    if (!memNo || memNo !== board?.memNo) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/board/delete/${boardNo}`, {
        data: { memNo: memNo },
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
    if (!memNo) {
      alert("로그인 후 이용 가능합니다.");
      navigate(`/signin`);
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
        memNo: memNo,
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
  const handleReportClick = (targetNo, targetType, targetNickname) => {
    console.log("신고 대상 이름:", targetNickname);

    if (!memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin");
      return;
    }

    setReportTargetNo(targetNo.toString()); // 문자열로 변환
    setReportTargetType(targetType.toLowerCase()); // member, corporate, comment
    setReportTargetNickname(targetNickname);
    setShowReportModal(true);
  };

  // 신고하기 모달 취소하기 버튼
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  if (!board) return <h2>Loading...</h2>;

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
                  ? `${imgUrl}/${board.memProfilePath}`
                  : defaultImg
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
                onClick={() =>
                  handleReportClick(
                    board.boardNo,
                    "BOARD",
                    board.memNickname // 또는 board.member.memNickname
                  )
                }
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
      <CommentList boardNo={board.boardNo} memNo={memNo} />

      {/* 신고하기 모달 */}
      {showReportModal && reportTargetNo && (
        <ReportModalPage
          targetNo={reportTargetNo}
          targetType={reportTargetType}
          targetNickname={reportTargetNickname}
          memberNo={memNo}
          onClose={handleCloseReport}
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
