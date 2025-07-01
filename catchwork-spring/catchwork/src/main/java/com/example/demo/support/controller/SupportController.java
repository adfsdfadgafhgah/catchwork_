package com.example.demo.support.controller;


import java.util.List;

import com.example.demo.member.model.dto.CustomUserDetails;
import com.example.demo.support.model.dto.Support;
import com.example.demo.support.model.service.SupportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173") // 프론트 허용
@RestController
@RequestMapping("/support")
public class SupportController {

    @Autowired
    private SupportService supportService;

    // 문의하기 리스트 
    // 근데 콘솔창에 두번씩 뜬다 와이그럴까    
    @GetMapping("/list")
    public ResponseEntity<List<Support>> getSupportList() {
        List<Support> list = supportService.getSupportList();
        return ResponseEntity.ok(list);
    }
    
    // 문의하기 디테일
    @GetMapping("/detail/{id}")
    public ResponseEntity<Support> getSupportDetail(@PathVariable("id") int id) {
        Support support = supportService.findById(id);
        return ResponseEntity.ok(support);
    }
    
    // 문의하기 작성
    @PostMapping("/write")
    public ResponseEntity<?> writeSupport(@RequestBody Support support) {
        try {
            int result = supportService.insertSupport(support);
            if (result > 0) {
                return ResponseEntity.ok("저장 완료");
            } else {
                return ResponseEntity.status(500).body("저장 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();  // 콘솔에 에러 내용 출력
            return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
        }
    }

    
}
