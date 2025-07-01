package com.example.demo.board.model.dto;

import com.example.demo.member.model.dto.Member;

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
	// 게시글 목록 썸네일 이미지
	private String boardThumbnailUrl;
	
	// MEMBER 테이블 조인
	private String memNo;
	private String memNickname;
	private Member member;
	
	// 목록 조회 시 필요한 것
	private int commentCount;
	private int likeCount;
	
	// 게시글 작성자 프로필 이미지
	private String memProfilePath;
	
	
	// 좋아요 여부 확인
	private int likeCheck;

	private boolean likedByCurrentUser; // 로그인 유저가 좋아요 눌렀는지 여부

	

	
	
}
