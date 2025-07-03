package com.example.demo.member.myPage.membership.model.service;

import java.util.List;

import com.example.demo.member.myPage.membership.model.dto.MemberGrade;
import com.example.demo.member.myPage.membership.model.dto.Subscription;

public interface MembershipService {

	// 멤버십 리스트 조회
	List<MemberGrade> getMembershipList();

	// 구독 정보 조회
	Subscription getSubscription(String memNo);

}
