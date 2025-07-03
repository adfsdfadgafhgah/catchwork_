package com.example.demo.myPage.payment.scheduling;

import java.util.List;
import java.util.UUID;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.member.model.dto.Member;
import com.example.demo.myPage.membership.model.dto.MemberGrade;
import com.example.demo.myPage.membership.model.dto.Subscription;
import com.example.demo.myPage.payment.controller.PaymentController;
import com.example.demo.myPage.payment.model.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PaymentScheduling {
	
	@Autowired
	private PaymentController controller;

	@Autowired
	private PaymentService service;
	
	@Scheduled(cron = "0 0 9 * * *")
	// @Scheduled(cron = "*/30 * * * * *")
	public void billingScheduling() {
		log.info("결제 스케줄링 시작");
		// 등급 변경 대상 조회 및 등급 변경
		changeMemGrade();
		// 결제 상태 변경
		changeSubscriptionStatus();
		// 미납자의 정기 결제 시행
		executeBilling();
		log.info("결제 스케줄링 종료");
	}

	// @Scheduled(cron = "0 30 * * * *")
	public void billingUnpaidScheduling() {
		log.info("미납자 결제 스케줄링 시작");
		// 미납자의 정기 결제 시행
		executeBilling();
		log.info("미납자 결제 스케줄링 종료");
	}
	
	// 당일 정기 결제 대상의 결제 상태를 미납으로 변경
	private void changeSubscriptionStatus() {
		// 당일 결제 대상의 결제 상태를 미납으로 변경
		int result = service.changeSubscriptionStatus();
		if (result > 0) {
			log.info("결제 상태 변경 완료");
		} else {
			log.info("결제 상태 변경 사항 없음");
		}
	}
	
	// 미납자의 정기 결제 시행
	private void executeBilling() {
		// 미납자의 정보를 조회
		List<Member> members = service.selectUnpaidMembers();
		for (Member member : members) {
			// 미납자의 결제 데이터 파싱
			String memNo = member.getMemNo();
			String memEmail = member.getMemEmail();
			String memName = member.getMemName();

			// 미납자의 결제 대상 멤버십 정보 조회
			MemberGrade membership = service.selectMembership(memNo);
			// 주문번호 생성
			String orderId = UUID.randomUUID().toString().substring(0, 20);

			// 결제 데이터 파싱
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("customerKey", memNo);
			jsonObject.put("amount", membership.getMemGradePrice());
			jsonObject.put("orderName", membership.getMemGradeName());
			jsonObject.put("orderId", orderId);
			jsonObject.put("customerEmail", memEmail);
			jsonObject.put("customerName", memName);

			// 결제 요청
			ResponseEntity<JSONObject> response;
			try {
				response = controller.confirmBilling(jsonObject.toJSONString());
				if (response.getStatusCode() == HttpStatus.OK) {
					log.info("미납자의 정기 결제 시행 완료");
				}	else {
					log.error("미납자의 정기 결제 시행 실패");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	// 등급 변경 대상 조회 및 등급 변경
	private void changeMemGrade() {
		// 등급 변경 대상 정보 조회
		List<Subscription> subscriptions = service.selectTargetSubscription();
		for (Subscription subscription : subscriptions) {
			// 등급 변경 대상자의 구독 데이터 파싱
			String memNo = subscription.getMemNo();
			int memGrade = subscription.getMemGrade();

			// 등급 변경
			int result = service.changeMembership(memNo, memGrade);
			if (result > 0) {
				log.info("등급 변경 완료");
			} else {
				log.error("등급 변경 실패");
			}
		}
	}
}
