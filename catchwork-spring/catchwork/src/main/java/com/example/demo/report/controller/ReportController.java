package com.example.demo.report.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.report.model.dto.Report;
import com.example.demo.report.model.service.ReportService;

@RestController
@RequestMapping("/reportmodal")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // 중복 신고 확인 엔드포인트
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkReportStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam String reportTargetNo,
        @RequestParam String reportTargetType) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(false);
        }

        String memNo = userDetails.getUsername();
        boolean hasReported = reportService.hasUserAlreadyReported(reportTargetNo, reportTargetType, memNo);
        return ResponseEntity.ok(hasReported);
    }

    @PostMapping
    public ResponseEntity<String> insertReport(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody Report report) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("인증 정보가 없습니다.");
        }

        // 로그인 사용자 memNo 세팅
        String memNo = userDetails.getUsername();
        report.setMemNo(memNo);

        // System.out.println("===== 신고 데이터 확인 =====");
        // System.out.println(report);

        // 유효성 검사
        if (report.getReportTargetNo() == null || report.getReportTargetNo().isBlank()) {
            return ResponseEntity.badRequest().body("신고 대상 번호가 유효하지 않습니다.");
        }
        if (report.getReportCategoryCode() <= 0) {
            return ResponseEntity.badRequest().body("유효하지 않은 신고 카테고리 코드입니다.");
        }
        if (report.getReportContent() == null || report.getReportContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("신고 내용을 입력해주세요.");
        }
        if (report.getReportTargetType() == null || report.getReportTargetType().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("신고 대상 타입이 유효하지 않습니다.");
        }

        // 중복 신고 확인
        boolean hasReported = reportService.hasUserAlreadyReported(
            report.getReportTargetNo(),
            report.getReportTargetType(),
            report.getMemNo()
        );
        if (hasReported) {
            return ResponseEntity.badRequest().body("이미 신고한 대상입니다.");
        }

        int result = reportService.insertReport(report);
        if (result > 0) {
            return ResponseEntity.ok("신고가 접수되었습니다.");
        } else {
            return ResponseEntity.status(500).body("신고 접수 중 오류가 발생했습니다.");
        }
    }
}