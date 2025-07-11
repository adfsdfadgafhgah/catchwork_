package com.example.demo.member.myPage.payment.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.member.myPage.payment.model.service.PaymentService;

import lombok.extern.slf4j.Slf4j;

//@CrossOrigin(origins="http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("tosspayment")
@Slf4j
public class PaymentController {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	private static final String API_SECRET_KEY = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

	private final Map<String, String> billingKeyMap = new HashMap<>();

	@Autowired
	private PaymentService service;

	// 유효한 빌링키 조회
	@RequestMapping("getBillingKey")
	public ResponseEntity<?> getBillingKey(@RequestBody Map<String, String> map) {
		String memNo = map.get("memNo");
		// 유효한 빌링키 존재 플래그
		boolean hasBillingKey = false;
		String billingKey = null;

		try {
			billingKey = service.getBillingKey(memNo);

			// 유효한 빌링키가 있다면 true를 반환
			if (billingKey != null) {
				hasBillingKey = true;
			}
			return ResponseEntity.status(200).body(hasBillingKey);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	// 환불 잔액 조회
	@PostMapping("selectBalanceAmount")
	private ResponseEntity<Object> selectBalanceAmount(@RequestBody String jsonBody) {
		JSONObject requestData = parseRequestData(jsonBody);
		String memNo = (String) requestData.get("memNo");

		try {
			int balanceAmount = service.selectBalanceAmount(memNo);
			if (balanceAmount > 0) {
				return ResponseEntity.status(200).body(balanceAmount);
			}
			return ResponseEntity.status(200).body(0);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	// 멤버십 복구
	@PutMapping("restore")
	private ResponseEntity<Object> restoreSubscription(@RequestBody String jsonBody) {
		try {
			JSONObject requestData = parseRequestData(jsonBody);
			String memNo = (String) requestData.get("memNo");

			int result = service.restoreSubscription(memNo);

			if (result > 0) {
				return ResponseEntity.status(200).body("restore complete");
			}
			return ResponseEntity.status(200).body("restore failed");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	// 멤버십 다운그레이드
	@PutMapping("downgrade")
	private ResponseEntity<Object> downgradeMembership(@RequestBody String jsonBody) {
		try {
			JSONObject requestData = parseRequestData(jsonBody);
			String memNo = (String) requestData.get("memNo");
			int newGrade = ((Long) requestData.get("newGrade")).intValue();
			int result = service.downgradeSubscription(memNo, newGrade);

			if (result > 0) {
				return ResponseEntity.status(200).body("downgrade complete");
			}
			return ResponseEntity.status(200).body("downgrade failed");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	// 빌링 결제
	@PostMapping(value = "confirmBilling")
	public ResponseEntity<JSONObject> confirmBilling(@RequestBody String jsonBody) throws Exception {
		JSONObject requestData = parseRequestData(jsonBody);
		String customerKey = (String) requestData.get("customerKey");
		String billingKey = service.getBillingKey(customerKey);

		// API를 호출하여 빌링 결제
		JSONObject response = sendRequest(requestData, API_SECRET_KEY,
				"https://api.tosspayments.com/v1/billing/" + billingKey);

        // 결제 상태 초기화
        int status = 0;
		// 빌링 결제 시도 성공시
		if (!response.containsKey("error") && "DONE".equalsIgnoreCase((String) response.get("status"))) {
            log.info("빌링 결제 시도 성공");
			// 결제 내역을 DB에 저장
			int result = service.insertPayment(response, customerKey);
			// 결제 내역 저장 성공시, 사용자 등급 수정
			if (result > 0) {
				String orderName = (String) response.get("orderName");
				// 구독 정보 수정
				int updateResult = service.updateSubscription(customerKey, orderName, status);
                if(updateResult > 0) {
                    log.info("구독 정보 수정 완료");
                } else {
                    log.error("구독 정보 수정 실패");
                }
			}
		}
		// 빌링 결제 시도 실패시
        else if (!response.containsKey("error") && ("ABORTED".equalsIgnoreCase((String) response.get("status"))
				|| "EXPIRED".equalsIgnoreCase((String) response.get("status")))) {
                    log.info("빌링 결제 시도 실패");
            status = 2;
			// 결제 내역을 DB에 저장
			int result = service.insertPayment(response, customerKey);
            // 결제 내역 저장 성공시, 사용자 등급 수정
			if (result > 0) {
				String orderName = (String) response.get("orderName");
				// 구독 정보 수정
				int updateResult = service.updateSubscription(customerKey, orderName, status);
                if(updateResult > 0) {
                    log.info("구독 정보 수정 완료");
                } else {
                    log.error("구독 정보 수정 실패");
                }
			}
		}
		return ResponseEntity.status(response.containsKey("error") ? 400 : 200).body(response);
	}

	// 빌링키 발급
	@RequestMapping(value = "issueBillingKey")
	public ResponseEntity<JSONObject> issueBillingKey(@RequestBody String jsonBody) throws Exception {
		JSONObject requestData = parseRequestData(jsonBody);
		// API를 호출하여 빌링키 발급
		JSONObject response = sendRequest(requestData, API_SECRET_KEY,
				"https://api.tosspayments.com/v1/billing/authorizations/issue");

		// 빌링키 발급 성공시
		if (!response.containsKey("error")) {
			// 빌링키를 DB에 저장 후 결과 반환
			int result = service.insertBillingKey(response);
			if (result > 0) { // 빌링키 저장 성공시
				billingKeyMap.put(
					(String) requestData.get("customerKey"), 
					(String) response.get("billingKey"));
			}
		}

		return ResponseEntity.status(response.containsKey("error") ? 400 : 200).body(response);
	}

	private JSONObject parseRequestData(String jsonBody) {
		try {
			return (JSONObject) new JSONParser().parse(jsonBody);
		} catch (ParseException e) {
			logger.error("JSON Parsing Error", e);
			return new JSONObject();
		}
	}

	private JSONObject sendRequest(JSONObject requestData, String secretKey, String urlString) throws IOException {
		HttpURLConnection connection = createConnection(secretKey, urlString);
		try (OutputStream os = connection.getOutputStream()) {
			os.write(requestData.toString().getBytes(StandardCharsets.UTF_8));
		}

		try (InputStream responseStream = connection.getResponseCode() == 200 ? connection.getInputStream()
				: connection.getErrorStream();
				Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8)) {
			return (JSONObject) new JSONParser().parse(reader);
		} catch (Exception e) {
			logger.error("Error reading response", e);
			JSONObject errorResponse = new JSONObject();
			errorResponse.put("error", "Error reading response");
			return errorResponse;
		}
	}

	private HttpURLConnection createConnection(String secretKey, String urlString) throws IOException {
		URL url = new URL(urlString);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestProperty("Authorization",
				"Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8)));
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestMethod("POST");
		connection.setDoOutput(true);
		return connection;
	}
}
