package com.example.demo.member.board.model.service;

import java.util.List;

import com.example.demo.member.board.model.dto.Comment;

public interface CommentService {

	/** 댓글 목록 조회
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	List<Comment> getCommentList(int boardNo);

	/** 댓글 작성
	 * @author BAEBAE
	 * @param comment
	 * @return
	 */
	int writeComment(Comment comment);

	/** 댓글 수정
	 * @author BAEBAE
	 * @param comment
	 * @return
	 */
	int editComment(Comment comment);

	/** 댓글 삭제
	 * @author BAEBAE
	 * @param commentNo
	 */
	void deleteComment(int commentNo);

	/** 댓글 삭제(스케줄러)
	 * @author JAEHO
	 * @param deleteTargetPeriod
	 * @return
	 */
	int removeTargetComment(int deleteTargetPeriod);
}
