package com.example.demo.myPage.membership.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberGrade {

	private int memGrade; // 멤버십 단계
	private String memGradeName; // 멤버십 명칭
	private int memGradePrice; // 멤버십 가격
	private String membershipBenefit; // 멤버십 설명
}
