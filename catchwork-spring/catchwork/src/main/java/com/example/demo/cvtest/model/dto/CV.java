package com.example.demo.cvtest.model.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CV {
	
	private int cvNo; // 이력서 번호
	
	private String memNo; // 회원번호(작성자)
	
	// 기본 정보
    private String memName;
    private String memPhone;
    private String memGender;
    private String memEmail;
    private String memBirth;

    // 이력서 정보
    private String cvAlias;
    private String mainAddress;
    private String detailAddress;
    private String militaryStatus;
    private String militaryBranch;
    private String militaryStartDate;
    private String militaryEndDate;
    private String selfIntroduction;

    // 동적 섹션 (key-value 구조로 받기 위해 Map 사용)
    private List<Map<String, Object>> education;
    private List<Map<String, Object>> experience;
    private List<Map<String, Object>> qualify;
    private List<Map<String, Object>> award;
    private List<Map<String, Object>> language;
    private List<Map<String, Object>> training;
    private List<Map<String, Object>> outer;
    private List<Map<String, Object>> portfolio;
    

}
