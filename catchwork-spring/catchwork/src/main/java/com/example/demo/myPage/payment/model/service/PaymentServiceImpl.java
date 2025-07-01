package com.example.demo.myPage.payment.model.service;

import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.myPage.payment.model.dto.BillingKey;
import com.example.demo.myPage.payment.model.dto.Payment;
import com.example.demo.myPage.payment.model.mapper.PaymentMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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
	
	// 구독 정보 수정
	@Override
	public int updateSubscription(String memNo, String orderName) {
		System.out.println("메서드 실행");
		System.out.println(memNo + "   " + orderName);
		// TODO 구독 테이블에 구독 정보 삽입/수정 + 사용자 등급 수정
		String selectResult = null;
		int updateResult = 0;
		int insertResult = 0;
		int result = 0;
		
		Map<String,String> map = new HashMap<>();
		map.put("memNo", memNo);
		map.put("orderName", orderName);
		
		// 1. 구독중인 서비스 조회 
		selectResult = mapper.selectSubscription(memNo);
		System.out.println("구독중인 서비스 조회" + selectResult);
		
		// 2. 구독중인 서비스가 있다면 수정
		if(selectResult!=null) {
			log.info("구독중인 서비스 있음");
			updateResult = mapper.updateSubscription(map);
		}
		// 3. 구독중인 서비스가 없다면 삽입
		else if(selectResult==null) {
			log.info("구독중인 서비스 없음");
			insertResult = mapper.insertSubscription(map);
		}
		
		// 4. 사용자 등급 수정
		log.info("구독정보 수정 완료");
		result = mapper.updateMemGrade(map);

		return result;
	}
	
	// 환불 잔액 조회
	@Override
	public int selectBalanceAmount(String memNo) {
		System.out.println("@@@@ 변수 : "+memNo);
		int result = mapper.selectBalanceAmount(memNo);
		System.out.println("@@@@ 결과 : "+result);
		return result;
	}
}
