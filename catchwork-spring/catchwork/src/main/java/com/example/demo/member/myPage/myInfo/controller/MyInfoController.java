package com.example.demo.member.myPage.myInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.myPage.myInfo.model.service.MyInfoService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("mypage")
@Slf4j
public class MyInfoController {

	@Autowired
	private MyInfoService myInfoService;

	// 회원 정보 수정
	@PostMapping("updateMemberInfo")
	public ResponseEntity<String> updateMemberInfo(@RequestBody Member member) {
		System.out.println("광고성 수신동의 : "+member.getMemSmsFl());
		try {
			System.out.println("try 실행");
			int result = myInfoService.updateMemberInfo(member);
			System.out.println("값이 나오나");
			if (result > 0) {
				System.out.println("수정 완료");
				return ResponseEntity.status(200).body("회원 정보 수정 완료");
			}
			System.out.println("수정 실패");
			return ResponseEntity.status(500).body("회원 정보 수정 실패");
		} catch (Exception e) {
			log.error("회원 정보 수정 실패", e);
			return ResponseEntity.status(500).body("회원 정보 수정 실패: " + e.getMessage());
		}
	}

	// 프로필 이미지 수정
	@PostMapping("uploadProfileImg")
	public ResponseEntity<String> updateProfileImg(@RequestParam("imgFile") MultipartFile profileImg,
			@RequestParam("memNo") String memNo) {
		System.out.println("메서드 매핑됨");
		System.out.println(memNo);
		System.out.println(profileImg.getOriginalFilename());
		try {
			int result = myInfoService.updateProfileImg(profileImg, memNo);
			if (result > 0)
				return ResponseEntity.status(200).body("프로필 이미지 수정 완료");
			return ResponseEntity.status(500).body("프로필 이미지 수정 실패");
		} catch (Exception e) {
			log.error("프로필 이미지 수정 실패", e);
			return ResponseEntity.status(500).body("프로필 이미지 수정 실패: " + e.getMessage());
		}
	}

	@PostMapping("verifyPassword")
	public ResponseEntity<Boolean> verifyPassword(@RequestBody Member loginMember) {
		System.out.println("비밀번호 확인 메서드 매핑");
		try {
			int result = myInfoService.verifyPassword(loginMember);
			if (result > 0) {
				System.out.println("비밀번호 일치");
				return ResponseEntity.status(200).body(true);
			}
			System.out.println("비밀번호 불일치");
			return ResponseEntity.status(500).body(false);
		} catch (Exception e) {
			log.error("비밀번호 확인 실패", e);
			return ResponseEntity.status(500).body(false);
		}
	}

	@PostMapping("changePw")
	public ResponseEntity<String> changePw(@RequestParam("currentPw") String currentPw,
			@RequestParam("memPw") String memPw, @RequestParam("memNo") String memNo) {
		System.out.println("비밀번호 변경 메서드 매핑");

		Member loginMember = new Member();
		loginMember.setMemNo(memNo);
		loginMember.setMemPw(currentPw);

		try {
			// 현재 비밀번호 확인
			int result = myInfoService.verifyPassword(loginMember);
			if (result > 0) {
				// 비밀번호 변경
				result = myInfoService.changePw(memPw, memNo);
				if (result > 0) {
					System.out.println("비밀번호 변경 완료");
					return ResponseEntity.status(200).body("비밀번호 변경 완료");
				}
				System.out.println("비밀번호 변경 실패");
				return ResponseEntity.status(500).body("비밀번호 변경 실패");
			}
			System.out.println("비밀번호 확인 실패");	
			return ResponseEntity.status(500).body("비밀번호 확인 실패");
		} catch (Exception e) {
			log.error("비밀번호 변경 실패", e);
			return ResponseEntity.status(500).body("비밀번호 변경 실패: " + e.getMessage());
		}
	}
}
