package com.example.demo.support.model.dto;

import lombok.Data;

@Data
public class Support {
    private int supportNo; 					// 문의 번호
    private String supportContent;			// 문의 내용
    private String supportAnswer;			// 문의 답변
    private String supportStatus;			// 문의 처리상태
    private int memNo;						// 회원 번호
    private int adminNo;					// 관리자 번호
    private String supportCategoryName;		// 문의 카테고리 이름
    private int supportCategoryCode;		// 문의 카테고리 코드

}
