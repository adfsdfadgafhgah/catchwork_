package com.example.demo.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
	
	private int commentNo;
	private String commentContent;
	private String commentWriteDate;
	private String commentEditDate;
	private int commentStatus;
	private String commentStatusDate;
	
	// 어느 게시글?
	private int boardNo;
	
	// 부모 댓글
	private int parentCommentNo;
	
	// 댓글 조회 시 회원 프로필, 이름
	private String memProfilePath;
	private String memNickname;

}
