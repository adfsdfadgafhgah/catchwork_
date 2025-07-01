package com.example.demo.cv.model.dto;

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
	
	private int cvNo;           				// 이력서 번호
	private String cvResume;     				// 자기소개서 내용
	private String cvAlias;      				// 이력서 별칭
	private String cvImgPath;					// 이력서 이미지 경로
	private char cvMainFl;    					// 대표 이력서 여부
	private String memNo;          				// 회원 번호 (FK → MEMBER)
	private String memAddress;   				// 주소 (mainAddress/detailAddress 형식으로 프론트에서 결합 전송)
	
	// 연관 데이터
	private List<CVExperience> experienceList;	// 경력 리스트
	private List<CVAward> awardList;			// 수상 리스트
	private List<CVQualify> qualifyList;		// 자격 리스트
	private List<CVLanguage> languageList;		// 어학 리스트
	private List<CVOuter> outerList;			// 대외 리스트
	private List<CVTraining> trainingList;		// 교육 리스트
	private List<CVPortfolio> portfolioList;	// 포폴 리스트
	private CVEducation education; 				// 단일 학력
	private CVMilitary military;   				// 단일 병역
    

}
