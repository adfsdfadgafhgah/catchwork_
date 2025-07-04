package com.example.demo.support.model.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Support {
    private int supportNo; 					// 문의 번호
    private String supportTitle; 			// 문의 제목
    private String supportContent;			// 문의 내용
    private String supportAnswer;			// 문의 답변
    private String supportStatus;			// 문의 처리상태
    private String memNo;					// 회원 번호
    private int adminNo;					// 관리자 번호
//    private Integer adminNo;				// 관리자 번호
    private String supportCategoryName;		// 문의 카테고리 이름
    private int supportCategoryCode;		// 문의 카테고리 코드
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private String supportDate;				// 문의 작성일
    
    private int seqNo; 						// 문의 회원별 순번
    

}