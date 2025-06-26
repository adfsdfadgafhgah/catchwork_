package com.example.demo.myPageTest.payment.model.service;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.myPageTest.payment.model.dto.BillingKey;
import com.example.demo.myPageTest.payment.model.dto.Payment;
import com.example.demo.myPageTest.payment.model.mapper.PaymentMapper;

@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
public class PaymentServiceImpl implements PaymentService{
	
	@Autowired
	private PaymentMapper mapper;
	
	// 유효한 빌링키 조회
	@Override
	public String getBillingKey(String memNo) {
		return mapper.getBillingKey(memNo);
	}
	
	// 발급받은 빌링키 저장
	@Override
	public int insertBillingKey(JSONObject response) {
		
		BillingKey billingKey = BillingKey.builder()
			    .billingKey((String) response.get("billingKey"))
			    .billingMethod((String) response.get("method"))
			    .cardCompany((String) response.get("cardCompany"))
			    .cardNumber((String) response.get("cardNumber"))
			    .cardType((String) ((JSONObject) response.get("card")).get("cardType"))
			    .ownerType((String) ((JSONObject) response.get("card")).get("ownerType"))
			    .issuerCode((String) ((JSONObject) response.get("card")).get("issuerCode"))
			    .acquirerCode((String) ((JSONObject) response.get("card")).get("acquirerCode"))
			    .authenticatedAt((String) response.get("authenticatedAt"))
			    .memNo((String) response.get("customerKey"))
			    .mId((String) response.get("mId"))
			    .build();

		return mapper.insertBillingKey(billingKey);
	}
	
	// 결제 내역 저장
	@Override
	public int insertPayment(JSONObject response, String customerKey) {
		
		Payment payment = Payment.builder()
			    .orderId((String) response.get("orderId"))
			    .orderName((String) response.get("orderName"))
			    .paymentKey((String) response.get("paymentKey"))
			    .memNo(customerKey)
			    .totalAmount(((Number) response.get("totalAmount")).longValue())
			    .balanceAmount(((Number) response.get("balanceAmount")).longValue())
			    .currency((String) response.get("currency"))
			    .country((String) response.get("country"))
			    .payType((String) response.get("method"))
			    .status((String) response.get("status"))
			    .requestedAt((String) response.get("requestedAt"))
			    .approvedAt((String) response.get("approvedAt"))
			    .cancels((String) response.get("cancels"))
			    .failure((String) response.get("failure"))
			    .build();
		
		return mapper.insertPayment(payment);
	}
	
	@Override
	public int updateSubscription(String memNo, String orderName) {
		// TODO 구독 테이블에 구독 정보 삽입/수정 + 사용자 등급 수
		return 0;
	}
}
