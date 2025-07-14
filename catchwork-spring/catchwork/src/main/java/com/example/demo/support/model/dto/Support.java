package com.example.demo.support.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Support {
    private int supportNo; 					// 문의 번호
    private String supportTitle; 			// 문의 제목
    private String supportContent;			// 문의 내용
    private String supportAnswer;			// 문의 답변
    private String supportStatus;			// 문의 처리상태
    
    // 문의 카테고리 정보
    private String supportCategoryName;		// 문의 카테고리 이름
    private int supportCategoryCode;		// 문의 카테고리 코드
    
    private LocalDateTime supportDate; 		// 문의 작성일
    private LocalDateTime supportAnswerDate; // LocalDateTime으로 타입 변경
    
    private int seqNo; 						// 문의 회원별 순번
    
    // 문의 작성자 정보
    private String memNo;					// 회원 번호
    private String memNickname;
    private String memName;
    
    // 답변 관리자 정보
    private int adminNo;					// 관리자 번호
    private String adminNickname;
    private String adminName;
    
	

	
    
}