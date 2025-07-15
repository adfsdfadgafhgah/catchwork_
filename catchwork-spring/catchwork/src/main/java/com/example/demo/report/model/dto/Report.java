package com.example.demo.report.model.dto;

import java.util.Date;
import java.util.List;

import com.example.demo.member.cv.model.dto.CV;
import com.example.demo.member.cv.model.dto.CVAward;
import com.example.demo.member.cv.model.dto.CVEducation;
import com.example.demo.member.cv.model.dto.CVExperience;
import com.example.demo.member.cv.model.dto.CVLanguage;
import com.example.demo.member.cv.model.dto.CVMilitary;
import com.example.demo.member.cv.model.dto.CVOuter;
import com.example.demo.member.cv.model.dto.CVPortfolio;
import com.example.demo.member.cv.model.dto.CVQualify;
import com.example.demo.member.cv.model.dto.CVTraining;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {							
    private int reportNo;						// 신고 번호
    private String reportTargetNo;				// 신고 타겟 번호
    private String reportTargetType;			// 신고 타겟 타입
    private String reportContent;				// 신고 내용
    private String reportStatus;				// 신고 상태
    private Date reportDate;					// 신고 날짜
    private int reportCategoryCode;				// 신고 카테고리 코드
    private String memNo;  						// 로그인한 사용자 번호
    
    private String reportCategoryName;			// 신고 카테고리 이름
    private String memNickname;					// 신고자 닉네임
}
