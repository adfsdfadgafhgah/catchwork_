package com.example.demo.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.board.model.dto.Board;

@Mapper
public interface BoardMapper {

	/** 게시판 목록 조회
	 * @author BAEBAE
	 * @param query
	 * @return
	 */
	List<Board> selectBoardsByLatest(String query);

	List<Board> selectBoardsByOldest(String query);

	List<Board> selectBoardsByLikes(String query);

	List<Board> selectBoardsByComments(String query);
	
	//-----------------------------------------------------------------

	/** 게시글 상세 조회
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	Board selectBoardDetail(int boardNo);

	int selectLikeCount(int boardNo);

	int selectCommentCount(int boardNo);

	int checkUserLiked(int boardNo, Integer memNo);

	//-----------------------------------------------------------------
	
	/** 게시글 수정
	 * @author BAEBAE
	 * @param board
	 * @return
	 */
	int editBoard(Board board);
	

}
