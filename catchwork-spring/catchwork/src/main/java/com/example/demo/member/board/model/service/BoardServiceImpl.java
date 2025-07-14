package com.example.demo.member.board.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.member.board.model.dto.Board;
import com.example.demo.member.board.model.mapper.BoardMapper;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	private BoardMapper boardMapper;

	@Autowired
	private ImageUploadService imageUploadService;
	
	/**
	 * 게시판 목록 조회
	 * 
	 * @author BAEBAE
	 */
	@Override
	public List<Board> selectBoardList(String sort, String query, String memNo, Integer limit) {
		return boardMapper.selectBoardList(sort, query, memNo, limit);
	}

	/**
	 * 게시글 상세
	 * 
	 * @author BAEBAE
	 */
	@Override
	@Transactional(readOnly = true)
	public Board selectBoardDetail(int boardNo, String memNo) {

		Board board = boardMapper.selectBoardDetail(boardNo);
		if (board == null)
			return null;

		// 좋아요 개수
		int likeCount = boardMapper.selectLikeCount(boardNo);
		board.setLikeCount(likeCount);

		// 댓글 개수
		int commentCount = boardMapper.selectCommentCount(boardNo);
		board.setCommentCount(commentCount);

		// 로그인 유저가 좋아요 눌렀는지 확인
		if (memNo != null && !memNo.trim().isEmpty()) {
			boolean liked = boardMapper.checkUserLiked(boardNo, memNo) > 0;
			board.setLikedByCurrentUser(liked);
		}

		return board;
	}

	/**
	 * 게시글 수정
	 * 
	 * @author BAEBAE
	 */
	@Override
	public int editBoard(Board board) {

		return boardMapper.editBoard(board);
	}

	/**
	 * 게시글 좋아요
	 * 
	 * @author BAEBAE
	 */
	@Override
	public boolean toggleLike(int boardNo, String memNo) {
		boolean alreadyLiked = boardMapper.selectBoardLike(boardNo, memNo) > 0;
		if (alreadyLiked) {
			boardMapper.deleteBoardLike(boardNo, memNo);
			return false;
		} else {
			boardMapper.insertBoardLike(boardNo, memNo);
			return true;
		}
	}

	/**
	 * 게시글 작성
	 * 
	 * @author BAEBAE
	 */
	@Override
	public int writeBoard(Board board, MultipartFile thumbnailFile) {

		int result = boardMapper.writeBoard(board);

		if (result > 0) {
			int newBoardNo = board.getBoardNo();
			if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
				result = imageUploadService.uploadBoardThumbnail(thumbnailFile, newBoardNo);	
				if (result > 0) {
					return newBoardNo;
				}
				// throw new RuntimeException("썸네일 이미지 업로드 실패");
			}
			return newBoardNo;
		}
		return result;
	}

	/**
	 * 게시글 삭제
	 * 
	 * @author BAEBAE
	 */
	@Override
	public boolean deleteBoard(int boardNo, String memNo) {

		String writerNo = boardMapper.findWriterByBoardNo(boardNo);

		if (writerNo == null || !writerNo.equals(memNo)) {
			return false; // 작성자 아니면 삭제 불가
		}
		int rows = boardMapper.deleteBoard(boardNo, memNo);
		return rows > 0;
	}

	/**
	 * 게시글 조회수 증가
	 * 
	 * @author BAEBAE
	 */
	@Override
	public void readCount(int boardNo) {
		boardMapper.readCount(boardNo);
	}
}
