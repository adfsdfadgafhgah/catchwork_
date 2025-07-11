package com.example.demo.corp.myPage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

@RestController
@RequestMapping("/corp")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CorpMyPageController {

    @Autowired
    private CorpMyPageService corpMyPageService;

    // 🔄 기업 회원 정보 수정
    @PutMapping("/edit")
    public ResponseEntity<?> updateMemberInfo(@RequestBody CorpMyPage corpMyPage) {
        corpMyPageService.updateMemberInfo(corpMyPage);
        return ResponseEntity.ok().build();
    }

//    // 🔐 비밀번호 확인용 회원 비밀번호 조회
//    @GetMapping("/confirm-password")
//    public ResponseEntity<String> getMemberPassword(@AuthenticationPrincipal CustomUserDetails loginMember) {
//        String password = corpMyPageService.selectMemberPassword(loginMember.getMember().getMemNo());
//        return ResponseEntity.ok(password);
//    }
//
//    // 🔐 비밀번호 변경
//    @PutMapping("/change-password")
//    public ResponseEntity<?> changePassword(@AuthenticationPrincipal CustomUserDetails loginMember,
//                                            @RequestBody CorpMyPage corpMyPage) {
//        corpMyPage.setMemNo(loginMember.getMember().getMemNo());
//        corpMyPageService.changePassword(corpMyPage);
//        return ResponseEntity.ok().build();
//    }
//
//    // 🔕 회원 탈퇴
//    @PutMapping("/withdraw")
//    public ResponseEntity<?> withdraw(@AuthenticationPrincipal CustomUserDetails loginMember) {
//        corpMyPageService.withdraw(loginMember.getMember().getMemNo());
//        return ResponseEntity.ok().build();
//    }
}
