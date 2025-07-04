package com.example.demo.corp.recruit.model.dto;

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
	private String recruitStartDate;
	private String recruitEndDate;
	private String recruitType;
	private String recruitDocx;
	private String recruitApply;
	private String recruitResultDate;
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
	private String memNo;
	private int corpNo;
	private String corpRegNo;
	private String corpMemRoleCheck;
	private String corpMemDept;
	
	private String corpLogo;
	private String corpType;
	private String corpName;
	
	private int likeCount;
	private int likeCheck;
	private boolean likedByCurrentUser; // 로그인 유저가 좋아요 눌렀는지 여부
}
