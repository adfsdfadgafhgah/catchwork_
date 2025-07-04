package com.example.demo.member.myPage.payment.model.service;

import java.util.List;

import org.json.simple.JSONObject;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.myPage.membership.model.dto.MemberGrade;
import com.example.demo.member.myPage.membership.model.dto.Subscription;

public interface PaymentService {

	// 유효한 빌링키 조회
	String getBillingKey(String memNo);

	// 발급받은 빌링키 저장
	int insertBillingKey(JSONObject response);

	// 결제 내역 저장
	int insertPayment(JSONObject response, String customerKey);

	// 구독 정보 수정
	int updateSubscription(String memNo, String orderName, int status);

	// 환불 잔액 조회
	int selectBalanceAmount(String memNo);
	
	// 멤버십 다운그레이드
	int downgradeSubscription(String memNo, int newGrade);
	
	// 멤버십 정보 변경
	int changeMembership(String memNo, int memGrade);

	// 멤버십 명칭 조회
	String getOrderName(int newGrade);

	// 멤버십 복구
	int restoreSubscription(String memNo);

	// 결제 상태 변경
	int changeSubscriptionStatus();

	// 미납자 조회
	List<Member> selectUnpaidMembers();

	// 미납자의 결제 대상 멤버십 정보 조회
	MemberGrade selectMembership(String memNo);

	// 등급 변경 대상 조회
	List<Subscription> selectTargetSubscription();
}
