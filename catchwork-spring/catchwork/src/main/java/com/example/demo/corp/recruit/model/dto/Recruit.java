// com/example/demo/corp/recruit/model/dto/Recruit.java

package com.example.demo.corp.recruit.model.dto;

import java.time.LocalDate; // [추가] java.time.LocalDate 임포트
import com.fasterxml.jackson.annotation.JsonFormat; // [추가] @JsonFormat 어노테이션 임포트

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Recruit {
	
	private int recruitNo;
	private String recruitTitle;
	
	// String -> LocalDate 타입으로 변경, JSON 날짜 형식 지정
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate recruitStartDate;
	
	// String -> LocalDate 타입으로 변경, JSON 날짜 형식 지정
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate recruitEndDate;
	
	private String recruitType;
	private String recruitDocx;
	private String recruitApply;
	
	// String -> LocalDate 타입으로 변경, JSON 날짜 형식 지정
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate recruitResultDate;
	
	private String recruitCorpUrl;
	private String recruitHireDetail;
	private String recruitJobName;
	private String recruitJobDetail;
	private String recruitJobArea;
	private String recruitCareer;
	private String recruitEdu;
	private int recruitHeadcount;
	private String recruitSalary;
	private String recruitEtc;
	private int recruitReadCount;
	private int recruitStatus;
	private String recruitStatusDate;
	private String recruitWriteDate;
	
	// 기업 회원 join
	private Integer corpNo;
	private String corpRegNo;
	private String corpMemRoleCheck;
	private String corpMemDept;
	private String corpBenefit;
	private String corpBenefitDetail;
	private String corpLogo;
	private String corpType;
	private String corpName;
	
	// 멤버 타입1 기업회원 정보
	private String memNo;
	private String memNickname;
	private String memName;
	private String memProfilePath;

	private int likeCount;
	private int likeCheck;
	private boolean likedByCurrentUser; // 로그인 유저가 좋아요 눌렀는지 여부
}