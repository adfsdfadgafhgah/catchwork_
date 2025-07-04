package com.example.demo.member.myPage.payment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.myPage.membership.model.dto.MemberGrade;
import com.example.demo.member.myPage.membership.model.dto.Subscription;
import com.example.demo.member.myPage.payment.model.dto.BillingKey;
import com.example.demo.member.myPage.payment.model.dto.Payment;

@Mapper
public interface PaymentMapper {

	// 유효한 빌링키 조회
	String getBillingKey(String memNo);

	// 발급받은 빌링키 저장
	int insertBillingKey(BillingKey billingKey);

	// 결제 내역 저장
	int insertPayment(Payment payment);

	// 구독중인 서비스 조회
	String selectSubscription(String memNo);

	// 구독중인 서비스 수정
	int updateSubscription(Map<String, Object> map);

	// 신규 구독 삽입
	int insertSubscription(Map<String, Object> map);

	// 사용자 등급 수정
	int updateMemGrade(Map<String, Object> map);

	// 환불 잔액 조회
	Integer selectBalanceAmount(String memNo);

	// 멤버십 다운그레이드
	Integer downgradeSubscription(Map<String, Object> map);

	// 멤버십 명칭 조회
	String getOrderName(int newGrade);

	// 멤버십 정보 변경
	int changeMembership(Map<String, Object> map);

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

	// 결제 상태 변경
	int changeSubscription(Map<String, Object> map);
}
