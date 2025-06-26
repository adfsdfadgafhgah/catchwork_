package com.example.demo.myPageTest.payment.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.myPageTest.payment.model.dto.BillingKey;
import com.example.demo.myPageTest.payment.model.dto.Payment;

@Mapper
public interface PaymentMapper {

	// 유효한 빌링키 조회
	String getBillingKey(String memNo);

	// 발급받은 빌링키 저장
	int insertBillingKey(BillingKey billingKey);

	// 결제 내역 저장
	int insertPayment(Payment payment);

}
