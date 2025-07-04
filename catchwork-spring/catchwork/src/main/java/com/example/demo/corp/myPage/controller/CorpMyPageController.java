package com.example.demo.corp.myPage.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/corp")
@RequiredArgsConstructor
public class CorpMyPageController {

    private final CorpMyPageService corpMyPageService;

    // 로그인된 기업 회원의 마이페이지 정보 조회
    @GetMapping("/mypage")
    public ResponseEntity<CorpMyPage> getCorpInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String corpId = userDetails.getUsername(); // 로그인된 기업 ID
        CorpMyPage corpInfo = corpMyPageService.getCorpMyPage(corpId);
        return ResponseEntity.ok(corpInfo);
    }

}
