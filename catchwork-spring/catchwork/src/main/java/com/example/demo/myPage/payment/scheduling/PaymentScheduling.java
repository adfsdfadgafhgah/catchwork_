package com.example.demo.myPage.payment.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.myPage.payment.controller.PaymentController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PaymentScheduling {
	
	@Autowired
	private PaymentController controller;
	
	@Scheduled(cron = "0 0 9 * * *")
	public void billingScheduling() {
		// todo : 매일 오전 9시마다 당일 정기결제 대상의 결제를 일괄 시행
	}

}
