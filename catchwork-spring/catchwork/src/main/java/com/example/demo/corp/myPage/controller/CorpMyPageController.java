package com.example.demo.corp.myPage.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

@RestController
@RequestMapping("/corp") // 기본 경로 설정
public class CorpMyPageController {

    @Autowired
    private CorpMyPageService corpMyPageService;

    // 기업 마이페이지 정보 조회 (GET 요청)
    @GetMapping("/mypage")
    public ResponseEntity<CorpMyPage> getCorpMyPage(@AuthenticationPrincipal CustomUserDetails user) {
        String memNo = user.getUsername();
        CorpMyPage corpMyPage = corpMyPageService.getCorpMyPage(memNo);
        System.out.println("✅ 백엔드 반환값: " + corpMyPage);   // 콘솔로그 
        return ResponseEntity.ok(corpMyPage);
    }
    
    // 기업 회원 정보 수정 (PUT 요청)
    @PostMapping("/updateMemberInfo")
    public ResponseEntity<?> updateMemberInfo(@RequestBody CorpMyPage corpMyPage, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        // 인증되지 않은 사용자 접근 방지
        if (customUserDetails == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized 반환
        }	
        // 인증된 사용자의 memNo를 DTO에 설정하여, 본인 정보만 수정하도록 강제
        corpMyPage.setMemNo(customUserDetails.getUsername());
        corpMyPageService.updateMemberInfo(corpMyPage); // 서비스 호출하여 정보 업데이트
        return ResponseEntity.ok().build(); // 성공 시 200 OK 반환
    }

    // 비밀번호 확인 (POST 요청)
    @PostMapping("/verifyPassword")
    public ResponseEntity<Boolean> verifyPassword(@RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        // 인증되지 않은 사용자 접근 방지
        if (customUserDetails == null) {
            return ResponseEntity.status(401).body(false); // 401 Unauthorized 반환
        }

        String memNo = customUserDetails.getUsername(); // 로그인한 사용자의 회원 번호
        String inputPassword = payload.get("memPw"); // 프론트엔드에서 전달받은 비밀번호

//        System.out.println("DEBUG: verifyPassword 호출 시 전달되는 memNo: " + memNo);
//        System.out.println("DEBUG: verifyPassword 호출 시 전달되는 inputPassword: " + inputPassword);

        // 서비스 계층을 통해 비밀번호 일치 여부 확인
        boolean isPasswordValid = corpMyPageService.verifyPassword(memNo, inputPassword);

        if (isPasswordValid) {
            return ResponseEntity.ok(true); // 비밀번호 일치 시 true 반환
        } else {
            return ResponseEntity.status(401).body(false); // 비밀번호 불일치 시 401 Unauthorized와 false 반환
        }
    }
}