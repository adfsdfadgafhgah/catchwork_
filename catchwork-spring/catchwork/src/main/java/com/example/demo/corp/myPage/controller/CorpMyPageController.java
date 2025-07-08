package com.example.demo.corp.myPage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

@RestController
@RequestMapping("/corp")
@CrossOrigin(origins = "http://localhost:5173")  // React 개발서버 주소
public class CorpMyPageController {

    @Autowired
    private CorpMyPageService corpMyPageService;

    @GetMapping("/mypage")
    public ResponseEntity<?> getCorpInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String corpId = userDetails.getUsername();  // 로그인한 기업 회원 아이디
        CorpMyPage corpInfo = corpMyPageService.getCorpInfoById(corpId);

        if (corpInfo != null) {
            return ResponseEntity.ok(corpInfo);
        } else {
            return ResponseEntity.status(404).body("기업 정보를 찾을 수 없습니다.");
        }
    }
}
