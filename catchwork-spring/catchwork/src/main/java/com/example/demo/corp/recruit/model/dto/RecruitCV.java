package com.example.demo.corp.recruit.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitCV {
	
	 	private int recruitCvNo;              // 지원 이력서 시퀀스 번호 (PK)
	 	private String recruitCvEdu;          // 학력
	 	private String recruitCvCareer;       // 경력
	    private String recruitCvPdfTitle;     // 지원자 이력서 PDF 제목
	    private String recruitCvPdfPath;      // 지원자 이력서 PDF 경로 (파일 다운로드용)
	    private String recruitCvDate;         // 지원자 지원 날짜
	    private String recruitCvCheckFl;      // 다운로드 여부
	    private String memNo;				  // 회원 번호 (FK)
	    private int recruitNo;                // 공고 번호 (FK)
	   
	   //조인
	    private String recruitTitle;          // 공고 제목
	    
	    //경력 개월수로 바꾸려고
	    private Integer careerMin;
	    private Integer careerMax;
	    
}
