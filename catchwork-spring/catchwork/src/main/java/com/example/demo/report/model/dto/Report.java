package com.example.demo.report.model.dto;

import java.util.Date;
import lombok.Data;

@Data
public class Report {							
    private int reportNo;						// 신고 번호
    private String reportTargetNo;				// 신고 타겟 번호
    private String reportTargetType;			// 신고 타겟 타입
    private String reportContent;				// 신고 내용
    private String reportStatus;				// 신고 상태
    private Date reportDate;					// 신고 날짜
    private int reportCategoryCode;				// 신고 카테고리 코드
    private String memNo;  						// 로그인한 사용자 번호
}
