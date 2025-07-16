package com.example.demo.admin.model.dto;

import lombok.Data;

@Data
public class TargetInfo {
	
	private String no;       // 대상의 고유 번호 (BOARD_NO, MEM_NO 등)
    private String type;     // 대상의 타입 (BOARD, MEMBER 등)
    private String content;  // 대표 내용 (게시글 제목, 기업명 등)
    private String author;   // 작성자 닉네임 (게시글, 댓글, 공고의 경우)
    private int status;      // 대상의 현재 상태 코드
    
    // 작성자의 고유 번호를 담을 필드
    private String authorNo; 

}
