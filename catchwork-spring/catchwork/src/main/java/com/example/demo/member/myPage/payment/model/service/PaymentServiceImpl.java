package com.example.demo.member.myPage.payment.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.myPage.membership.model.dto.MemberGrade;
import com.example.demo.member.myPage.membership.model.dto.Subscription;
import com.example.demo.member.myPage.payment.model.dto.BillingKey;
import com.example.demo.member.myPage.payment.model.dto.Payment;
import com.example.demo.member.myPage.payment.model.mapper.PaymentMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
public class PaymentServiceImpl implements PaymentService {

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

		BillingKey billingKey = BillingKey.builder().billingKey((String) response.get("billingKey"))
				.billingMethod((String) response.get("method")).cardCompany((String) response.get("cardCompany"))
				.cardNumber((String) response.get("cardNumber"))
				.cardType((String) ((JSONObject) response.get("card")).get("cardType"))
				.ownerType((String) ((JSONObject) response.get("card")).get("ownerType"))
				.issuerCode((String) ((JSONObject) response.get("card")).get("issuerCode"))
				.acquirerCode((String) ((JSONObject) response.get("card")).get("acquirerCode"))
				.authenticatedAt((String) response.get("authenticatedAt")).memNo((String) response.get("customerKey"))
				.mId((String) response.get("mId")).build();

		return mapper.insertBillingKey(billingKey);
	}

	// 결제 내역 저장
	@Override
	public int insertPayment(JSONObject response, String customerKey) {

		Payment payment = Payment.builder().orderId((String) response.get("orderId"))
				.orderName((String) response.get("orderName")).paymentKey((String) response.get("paymentKey"))
				.memNo(customerKey).totalAmount(((Number) response.get("totalAmount")).longValue())
				.balanceAmount(((Number) response.get("balanceAmount")).longValue())
				.currency((String) response.get("currency")).country((String) response.get("country"))
				.payType((String) response.get("method")).status((String) response.get("status"))
				.requestedAt((String) response.get("requestedAt")).approvedAt((String) response.get("approvedAt"))
				.cancels((String) response.get("cancels")).failure((String) response.get("failure")).build();

		return mapper.insertPayment(payment);
	}

	// 구독 정보 수정
	@Override
	public int updateSubscription(String memNo, String orderName, int status) {
		// TODO 구독 테이블에 구독 정보 삽입/수정 + 사용자 등급 수정
		String selectResult = null;
		int updateResult = 0;
		int insertResult = 0;
		int result = 0;

		Map<String, Object> map = new HashMap<>();
		map.put("memNo", memNo);
		map.put("orderName", orderName);
		map.put("status", status); // 0: 결제 성공, 1: 변경 대기, 2: 결제 실패

		// 1. 구독중인 서비스 조회
		selectResult = mapper.selectSubscription(memNo);
//		System.out.println("구독중인 서비스 조회" + selectResult);

		// 2. 구독중인 서비스가 있다면 수정
		if (selectResult != null) {
			log.info("구독중인 서비스 있음");
			updateResult = mapper.updateSubscription(map);
		}
		// 3. 구독중인 서비스가 없다면 삽입
		else if (selectResult == null) {
			log.info("구독중인 서비스 없음");
			insertResult = mapper.insertSubscription(map);
		}

		// 4. 사용자 등급 수정
		log.info("구독정보 수정 완료");
		if (status == 0) {
			result = mapper.updateMemGrade(map);
		}

		// 4. 결제 실패이고 정기결제 실패 상황이면 MEMBER 등급 초기화
		if (status == 2 && selectResult != null && selectResult.equals(orderName)) {
			log.info("정기결제 실패 → MEMBER 등급 0으로 변경");
			result = cancelMemGrade(memNo);
		}
		return result;
	}

	// 사용자 등급 취소
	private int cancelMemGrade(String memNo) {
		Map<String, Object> map = new HashMap<>();
		map.put("memNo", memNo);
		map.put("orderName", "브론즈");
		return mapper.updateMemGrade(map);
	}

	// 환불 잔액 조회
	@Override
	public int selectBalanceAmount(String memNo) {
		Integer result = mapper.selectBalanceAmount(memNo);
		return result;
	}

	// 멤버십 다운그레이드
	@Override
	public int downgradeSubscription(String memNo, int newGrade) {
		Map<String, Object> map = new HashMap<>();
		map.put("memNo", memNo);
		map.put("newGrade", newGrade);

		Integer result = mapper.downgradeSubscription(map);
		return result;
	}

	// 멤버십 정보 변경
	@Override
	public int changeMembership(String memNo, int memGrade) {
		Map<String, Object> map = new HashMap<>();
		map.put("memNo", memNo);
		map.put("memGrade", memGrade);

		int result = 0;

		// 1. 멤버십 정보 변경
		result = mapper.changeMembership(map);
		// 2. 결제 상태 변경
		if (result > 0) {
			result = 0;
			result = mapper.changeSubscription(map);
		}

		if (result <= 0) {
			throw new RuntimeException("멤버십 정보 변경 실패");
		}

		return result;
	}

	// 멤버십 명칭 조회
	@Override
	public String getOrderName(int newGrade) {
		return mapper.getOrderName(newGrade);
	}

	// 멤버십 복구
	@Override
	public int restoreSubscription(String memNo) {
		return mapper.restoreSubscription(memNo);
	}

	// 결제 상태 변경
	@Override
	public int changeSubscriptionStatus() {
		int result = 0;
		result = mapper.changeSubscriptionStatus();
		return result;
	}

	// 미납자 조회
	@Override
	public List<Member> selectUnpaidMembers() {
		return mapper.selectUnpaidMembers();
	}

	// 미납자의 결제 대상 멤버십 정보 조회
	@Override
	public MemberGrade selectMembership(String memNo) {
		return mapper.selectMembership(memNo);
	}

	// 등급 변경 대상 조회
	@Override
	public List<Subscription> selectTargetSubscription() {
		return mapper.selectTargetSubscription();
	}
}
