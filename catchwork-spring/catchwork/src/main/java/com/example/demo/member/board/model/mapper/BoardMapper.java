package com.example.demo.member.board.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultMap;

import com.example.demo.member.board.model.dto.Board;

@Mapper
public interface BoardMapper {

	/**
	 * 게시판 목록 조회
	 * 
	 * @author BAEBAE
	 * @param query
	 * @return
	 */
	List<Board> selectBoardList(@Param("sort") String sort, @Param("query") String query, @Param("memNo") String memNo,@Param("limit") Integer limit);

	// -----------------------------------------------------------------

	/**
	 * 게시글 상세 조회
	 * 
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	@ResultMap("boardDetailMap")
	Board selectBoardDetail(@Param("boardNo") int boardNo);

	int selectLikeCount(int boardNo);

	int selectCommentCount(int boardNo);

	int checkUserLiked(@Param("boardNo") int boardNo, @Param("memNo") String memNo);

	// -----------------------------------------------------------------

	/**
	 * 게시글 수정
	 * 
	 * @author BAEBAE
	 * @param board
	 * @return
	 */
	int editBoard(Board board);

	// ----------------------------------------------------------------

	/**
	 * 게시글 좋아요
	 * 
	 * @author BAEBAE
	 * @param boardNo
	 * @param memNo
	 * @return
	 */
	int selectBoardLike(@Param("boardNo") int boardNo, @Param("memNo") String memNo);

	void deleteBoardLike(@Param("boardNo") int boardNo, @Param("memNo") String memNo);

//	void decreaseLikeCount(@Param("boardNo") int boardNo);

	void insertBoardLike(@Param("boardNo") int boardNo, @Param("memNo") String memNo);

//	void increaseLikeCount(@Param("boardNo") int boardNo);

	// ------------------------------------------------------------------

	/**
	 * 게시글 작성
	 * 
	 * @author BAEBAE
	 * @param board
	 * @return
	 */
	int writeBoard(Board board);

	/**
	 * 게시글 썸네일 업로드
	 * 
	 * @author JAEHO
	 * @param map
	 * @return
	 */
	int uploadBoardThumbnail(Map<String, Object> map);

	/**
	 * 게시글 작성자 조회
	 * 
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	String findWriterByBoardNo(int boardNo);

	/**
	 * 게시글 삭제
	 * 
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	int deleteBoard(@Param("boardNo") int boardNo, @Param("memNo") String memNo);

	/**
	 * 게시글 조회수 증가
	 * 
	 * @author BAEBAE
	 * @param boardNo
	 */
	void readCount(int boardNo);

}
