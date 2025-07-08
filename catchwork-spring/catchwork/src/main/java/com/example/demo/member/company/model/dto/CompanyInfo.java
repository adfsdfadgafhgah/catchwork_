package com.example.demo.member.company.model.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyInfo {
	
	//기업정보 테이블
	private int corpNo;                	// 기업_시퀀스_번호 (PK)
    private String corpRegNo;           // 기업_사업자등록번호 **String 으로 수정**
    private String corpType;            // 기업_형태
    private String corpName;            // 기업_회사명
    private String corpLogo;            // 기업_로고
    private String corpCeoName;         // 기업_대표명
    private String corpAddr;            // 기업_회사주소
    private String corpOpenDate;        // 기업_개업일자
    private String corpHomeLink;        // 기업_홈페이지링크
    private String corpBm;              // 기업_주요사업
    private String corpDetail;          // 기업_기업소개상세
    private String corpBenefit;         // 기업_복리후생_카테고리
    private String corpBenefitDetail;   // 기업_복리후생_내용
    private String corpBanFl;           // 기업_정지_플래그 String으로 받는게 맞나?
    private Date corpBanDate;           // 기업_정지일

    // MEMBER 테이블 조인
 	private String memNo;

    //추가정보
    private int recruitCount;			//공고 개수
    private int isSaved; 				// 1 = 관심등록함, 0 = 아님
    private int favs;					//관심 개수

  
}
