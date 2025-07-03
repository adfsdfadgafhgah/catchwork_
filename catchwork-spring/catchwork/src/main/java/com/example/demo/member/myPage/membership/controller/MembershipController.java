package com.example.demo.member.myPage.membership.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.member.myPage.membership.model.dto.MemberGrade;
import com.example.demo.member.myPage.membership.model.dto.Subscription;
import com.example.demo.member.myPage.membership.model.service.MembershipService;

import lombok.extern.slf4j.Slf4j;

//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("membership")
@Slf4j
public class MembershipController {

	@Autowired
	private MembershipService service;

	// 멤버십 리스트 조회
	@GetMapping("getMembershipList")
	private ResponseEntity<Object> getMembershipList() {
//		System.out.println("@@ 멤버십 아이템 리스트 로드 @@");
		List<MemberGrade> membershipList = service.getMembershipList();

		try {
			return ResponseEntity.status(HttpStatus.OK).body(membershipList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}

	}

	// 구독 정보 조회
	@PostMapping("getSubscription")
	private ResponseEntity<Object> getSubscription(@RequestBody Subscription targetSubscription) {
//		System.out.println("@@ 구독 정보 조회 @@");
		String memNo = targetSubscription.getMemNo();
//		System.out.println(memNo);
		try {
			Subscription subscription = service.getSubscription(memNo);
			
			if (subscription != null) {
				return ResponseEntity.status(HttpStatus.OK).body(subscription);
			}
			
			return ResponseEntity.status(HttpStatus.OK).body("have no subscription data");
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	

}
