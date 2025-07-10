package com.example.demo.support.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.support.model.dto.Support;
import com.example.demo.support.model.service.SupportService;

@RestController
@RequestMapping("/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    // 문의하기 리스트 
    // 근데 콘솔창에 두번씩 뜬다 와이그럴까    
    @GetMapping("/list")
    public ResponseEntity<List<Support>> getSupportList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String memNo = userDetails.getUsername(); // 또는 getMemNo() 확인
        System.out.println("로그인된 사용자 memNo = " + memNo);

        List<Support> list = supportService.getSupportListByMemNo(memNo);
        return ResponseEntity.ok(list);
    }
    
    // 문의하기 디테일 뜬다
    @GetMapping("/detail/{supportNo}")
    public ResponseEntity<Support> getSupportDetail(@PathVariable(name = "supportNo") int supportNo) {
        Support support = supportService.findById(supportNo);
        if (support != null) {
            return ResponseEntity.ok(support);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 문의하기 작성
    @PostMapping("/write")
    public ResponseEntity<?> insertSupport(
        @RequestBody Support support,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
        }

        support.setMemNo(userDetails.getUsername());

        int result = supportService.insertSupport(support);
        return result > 0
            ? ResponseEntity.ok("등록 성공")
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패");
    }

    
}