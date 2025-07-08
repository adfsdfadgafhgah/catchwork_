package com.example.demo.corp.recruit.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitCV {
	
	 	private int recruitCVNo;              // 지원 이력서 시퀀스 번호 (PK)
	 	private int recruitCVEdu;          	  // 학력
	 	private int recruitCVCareer;       	  // 경력
	    private String recruitCVPdfTitle;     // 지원자 이력서 PDF 제목
	    private String recruitCVPdfPath;      // 지원자 이력서 PDF 경로 (파일 다운로드용)
	    private String recruitCVDate;         // 지원자 지원 날짜
	    private String recruitCVCheckFl;      // 다운로드 여부
	    private String memNo;				  // 회원 번호 (FK)
	    private int recruitNo;                // 공고 번호 (FK)
	   
	    //조인
	    private String recruitTitle;          // 공고 제목
	    
	    //경력 개월수로 바꾸려고
	    private Integer careerMin;
	    private Integer careerMax;
	    
	    private List<Integer> cvNos; // 이력서 여러개 삭제용

	    
}
