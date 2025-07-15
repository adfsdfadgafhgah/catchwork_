package com.example.demo.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CorpInfo;
import com.example.demo.auth.model.service.CorpService;

@RestController
public class CorpController {

	private final CorpService corpService;

	public CorpController(CorpService corpService) {
		this.corpService = corpService;
	}

	@PostMapping("/corpegnocheck")
	// 1. DB 중복 확인 / 등록되어있을 시 TRUE 아닐 시 FALSE
	public ResponseEntity<Boolean> checkCorpregno(@RequestBody CorpInfo corp) {
		try {
			boolean valid = corpService.checkCorpRegNo(corp);
			return ResponseEntity.ok(valid); // 200 OK + true/false
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 에러
		}
	}

	@PostMapping("/corpegnoauth")
	// 2. 사업자 등록번호 유효성 검사 / 현재는 그냥 TRUE
	public ResponseEntity<Boolean> authCorpregno(@RequestBody CorpInfo corp) {
		try {
			boolean valid = corpService.authCorpRegNo(corp);
			return ResponseEntity.ok(valid); // 200 OK + true/false
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 에러
		}
	}
	
	@GetMapping("/auth/corpmem/name")
	public ResponseEntity<?> findMemName(@RequestParam(name="memNo") String memNo){
		String memName = corpService.findMemName(memNo);
        return ResponseEntity.ok(memName);
	}
}
