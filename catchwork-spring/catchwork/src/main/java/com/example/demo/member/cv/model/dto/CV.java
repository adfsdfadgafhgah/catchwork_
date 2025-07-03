package com.example.demo.member.cv.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CV {
	
	private int cvNo;           			// 이력서 번호
	private String cvResume;     			// 자기소개서 내용
	private String cvAlias;      			// 이력서 별칭
	private String cvImgPath;				// 이력서 이미지 경로
	private char cvMainFl;    				// 대표 이력서 여부
	private String memNo;          			// 회원 번호 (FK → MEMBER)
	
	// 연관 데이터
	private List<CVExperience> experience;	// 경력 리스트
	private List<CVAward> award;			// 수상 리스트
	private List<CVQualify> qualify;		// 자격 리스트
	private List<CVLanguage> language;		// 어학 리스트
	private List<CVOuter> outer;			// 대외 리스트
	private List<CVTraining> training;		// 교육 리스트
	private List<CVPortfolio> portfolio;	// 포폴 리스트
	private CVEducation education; 			// 단일 학력
	private CVMilitary military;   			// 단일 병역
    

}
