package com.example.demo.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CorpInfo;
import com.example.demo.auth.model.service.CorpService;

@RestController
public class CorpController {

    private final CorpService corpService;

    public CorpController(CorpService corpService) {
        this.corpService = corpService;
    }

    @PostMapping("/corpregister")
    public ResponseEntity<String> registerCorp(@RequestBody CorpInfo corp) {
    	System.out.println("기업등록 컨트롤러");
        Object result = corpService.registerCorp(corp);
        System.out.println(result);
        return ResponseEntity.ok("등록 성공");
    }

    @PostMapping("/corpegnocheck")
    public ResponseEntity<Boolean> checkCorpregno(@RequestBody CorpInfo corp) {
        try {
            boolean valid = corpService.checkCorpRegNo(corp);
            return ResponseEntity.ok(valid); // 200 OK + true/false
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 에러
        }
    }
}
