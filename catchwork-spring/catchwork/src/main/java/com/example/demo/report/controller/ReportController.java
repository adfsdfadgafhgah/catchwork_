package com.example.demo.report.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.report.model.dto.Report;
import com.example.demo.report.model.service.ReportService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reportmodal")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<String> insertReport(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @RequestBody Report report) {
        report.setMemNo(userDetails.getUsername()); // UUID or MEM_NO
        reportService.insertReport(report);
        return ResponseEntity.ok("신고가 접수되었습니다.");
    }
}
