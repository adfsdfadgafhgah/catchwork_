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
	// 기본 정보
    private String name;
    private String phone;
    private String gender;
    private String email;
    private String birth;

    // 이력서 정보
    private String resumeName;
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
