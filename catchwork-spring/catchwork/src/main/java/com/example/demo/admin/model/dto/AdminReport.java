package com.example.demo.admin.model.dto;

import lombok.Data;

@Data
public class AdminReport {
	
	private int reportNo;               // 신고 번호
    private String reportTargetType;    // 신고 대상 유형
    private String targetContentPreview;// 신고 대상 내용 미리보기
    private String reportContent; 		// 신고 내용
    private String reporterNickname;    // 신고자 닉네임
    private String reportDate;          // 신고일
    private String reportStatus;        // 처리 상태 (Y/N)
    
    private String reporterMemNo;       // 신고자의 고유 번호 (MEM_NO)
    private String reporterCorpNo;
    private String reporterName;

}
