// package com.example.demo.corp.myPage.controller;
package com.example.demo.corp.myPage.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

@RestController
@RequestMapping("/corp")
@CrossOrigin(origins = "http://localhost:5173")    // React 개발 서버 주소
public class CorpMyPageController {

    private static final Logger logger = LoggerFactory.getLogger(CorpMyPageController.class);

    @Autowired
    private CorpMyPageService corpMyPageService;

    /** 기업 마이페이지 메인 조회 */
    @GetMapping("/mypage")
    public ResponseEntity<?> getCorpInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            logger.warn("비로그인 사용자의 기업 마이페이지 조회 요청");
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String corpId = userDetails.getUsername(); // 로그인된 기업 아이디
        logger.info("기업 마이페이지 조회 요청 - 기업 ID: {}", corpId);

        CorpMyPage corpInfo = corpMyPageService.getCorpInfoById(corpId);

        if (corpInfo != null) {
            logger.info("조회된 기업 정보: {}", corpInfo.toString());
            return ResponseEntity.ok(corpInfo);
        }
        logger.warn("기업 정보를 찾을 수 없습니다 - 기업 ID: {}", corpId);
        return ResponseEntity.status(404).body("기업 정보를 찾을 수 없습니다.");
    }
}