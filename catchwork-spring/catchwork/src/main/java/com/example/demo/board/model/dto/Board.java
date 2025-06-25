package com.example.demo.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Board {
	
	// Board 전용
	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private String boardWriteDate;
	private String boardEditDate;
	private int boardReadCount;
	private int boardStatusCode;
	private String boardStatusDate;
	
	// MEMBER 테이블 조인
	private String memNo;
	
	// 목록 조회 시 필요한 것
	private int commentCount;
	private int likeCount;
	
	// 게시글 작성자 프로필 이미지
	private String memProfilePath;
	
	// 게시글 목록 썸네일 이미지
	private String thumbnail;
	
	// 좋아요 여부 확인
	private int likeCheck;
	
}
