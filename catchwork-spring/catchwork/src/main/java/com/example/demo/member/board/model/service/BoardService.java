package com.example.demo.member.board.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.member.board.model.dto.Board;

public interface BoardService {

	/** 게시판 목록 조회 서비스
	 * @author BAEBAE
	 * @param sort
	 * @param trim
	 * @return
	 */
	List<Board> selectBoardList(String sort, String query, String memNo,Integer page,Integer size, Integer limit);

	/** 게시글 상세 서비스
	 * @author BAEBAE
	 * @param boardNo
	 * @param memNo
	 * @return
	 */
	Board selectBoardDetail(int boardNo, String memNo);

	/** 게시글 수정
	 * @author BAEBAE
	 * @param board
	 * @return
	 */
	int editBoard(Board board, MultipartFile thumbnailFile, Boolean isDelete);

	/** 게시글 좋아요
	 * @author BAEBAE
	 * @param boardNo
	 * @param memNo
	 * @return
	 */
	boolean toggleLike(int boardNo, String memNo);

	/** 게시글 작성
	 * @author BAEBAE
	 * @param board
	 * @return
	 */
	int writeBoard(Board board, MultipartFile thumbnailFile);

	/** 게시글 삭제
	 * @author BAEBAE
	 * @param boardNo
	 * @param memNo
	 * @return
	 */
	boolean deleteBoard(int boardNo, String memNo);

	/** 게시글 조회수 증가
	 * @author BAEBAE
	 * @param boardNo
	 */
	void readCount(int boardNo);
}
