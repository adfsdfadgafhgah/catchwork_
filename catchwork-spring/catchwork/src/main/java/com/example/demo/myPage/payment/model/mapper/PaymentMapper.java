package com.example.demo.myPage.payment.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.myPage.payment.model.dto.BillingKey;
import com.example.demo.myPage.payment.model.dto.Payment;

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
	int updateSubscription(Map<String, String> map);

	// 신규 구독 삽입
	int insertSubscription(Map<String, String> map);

	// 사용자 등급 수정
	int updateMemGrade(Map<String, String> map);

	// 환불 잔액 조회
	int selectBalanceAmount(@Param("memNo") String memNo);

}
