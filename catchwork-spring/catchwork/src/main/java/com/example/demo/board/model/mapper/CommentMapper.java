package com.example.demo.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.board.model.dto.Comment;

@Mapper
public interface CommentMapper {

	/** 댓글 목록 조회
	 * @author BAEBAE
	 * @param boardNo
	 * @return
	 */
	List<Comment> selectCommentList(int boardNo);

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

}
