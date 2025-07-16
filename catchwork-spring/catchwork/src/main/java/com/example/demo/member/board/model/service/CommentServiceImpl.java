package com.example.demo.member.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.member.board.model.dto.Comment;
import com.example.demo.member.board.model.mapper.CommentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
public class CommentServiceImpl implements CommentService{
	
	private final CommentMapper commentMapper;

	/** 댓글 목록 조회
	 * @author BAEBAE
	 */
	@Override
	public List<Comment> getCommentList(int boardNo) {
		
		return commentMapper.selectCommentList(boardNo);
	}

	/** 댓글 작성
	 * @author BAEBAE
	 */
	@Override
	public int writeComment(Comment comment) {
		
		return commentMapper.writeComment(comment);
	}

	/** 댓글 수정
	 * @author BAEBAE
	 */
	@Override
	public int editComment(Comment comment) {
		
		return commentMapper.editComment(comment);
	}

	/** 댓글 삭제
	 * @author BAEBAE
	 */
	@Override
	public void deleteComment(int commentNo) {
		commentMapper.deleteComment(commentNo);
	}

	/** 댓글 삭제(스케줄러)
	 * @author JAEHO
	 */
	@Override
	public int removeTargetComment(int deleteTargetPeriod) {
		return commentMapper.removeTargetComment(deleteTargetPeriod);
	}	

}
