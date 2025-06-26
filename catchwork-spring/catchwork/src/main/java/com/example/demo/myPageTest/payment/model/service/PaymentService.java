package com.example.demo.myPageTest.payment.model.service;

import org.json.simple.JSONObject;

public interface PaymentService {

	// 유효한 빌링키 조회
	String getBillingKey(String memNo);

	// 발급받은 빌링키 저장
	int insertBillingKey(JSONObject response);

	// 결제 내역 저장
	int insertPayment(JSONObject response, String customerKey);

	// 구독 정보 수정
	int updateSubscription(String memNo, String orderName);

}
