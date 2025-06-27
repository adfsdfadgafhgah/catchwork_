package com.example.demo.myPageTest.membership.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.myPageTest.membership.model.dto.MemberGrade;
import com.example.demo.myPageTest.membership.model.service.MembershipService;

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
	public ResponseEntity<Object> getMembershipList() {
		List<MemberGrade> membershipList = service.getMembershipList();

		try {
			return ResponseEntity.status(HttpStatus.OK).body(membershipList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}

	}

}
