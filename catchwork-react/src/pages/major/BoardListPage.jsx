import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import BoardCard from "./BoardCard";

export default function BoardListPage() {
  const [boards, setBoards] = useState([]); // 게시글 목록 조회
  const [isloading, setIsLoading] = useState(true); // 로딩 상태

  // 게시글 목록 조회용 함수
  const getBoardList = async () => {
    try {
      const resp = await axiosApi.get("/board/boardList");
      console.log(resp.data);

      if (resp.status === 200) {
        setBoards(resp.data);
      }
    } catch (error) {
      console.log("게시글 목록 조회 중 에러 발생 : ", error);
    }
  };

  // 컴포넌트가 처음 렌더링 될 때 useEffect
  useEffect(() => {
    getBoardList();
  }, []);

  // boards 상태가 변경될 때 실행될 useEffect (isLoading값 변경)
  useEffect(() => {
    if (boards != null) {
      setIsLoading(false);
    }
  }, [boards]);

  if (isloading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="board-list">
      {boards.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        boards.map((board, index) => <BoardCard key={index} board={board} />)
      )}
    </div>
  );
}
