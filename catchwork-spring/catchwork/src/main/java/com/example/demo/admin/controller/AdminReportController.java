package com.example.demo.admin.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.admin.model.dto.ReportDetailResponse;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.admin.model.service.AdminReportService;
import com.example.demo.report.model.dto.Report;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminReportController {
	
	@Autowired
	private AdminReportService adminReportService;
	
    /** 신고 요약 정보 조회
     * @author BAEBAE
     * @param criteria 검색 및 필터 조건
     * @return 신고 요약 정보
     */
    @GetMapping("report/summary")
    public ResponseEntity<ReportSummary> getReportSummary(@ModelAttribute ReportSearchCriteria criteria) {
        ReportSummary summary = adminReportService.getReportSummary(criteria);
        return ResponseEntity.ok(summary);
    }
    
    /** 신고 처리 상태 변경
     * @author BAEBAE
     * @param payload
     * @return
     */
    @PutMapping("report/process")
    public ResponseEntity<String> processReport(@RequestBody Map<String, Integer> payload) {
        try {
            Integer reportNo = payload.get("reportNo");
            if (reportNo == null) {
                return ResponseEntity.badRequest().body("신고 번호가 필요합니다.");
            }

            Report reportToProcess = new Report();
            reportToProcess.setReportNo(reportNo);
            reportToProcess.setAdminNo(1); // 중요: 관리자 번호 1로 하드코딩

            int result = adminReportService.processReport(reportToProcess);

            if (result > 0) {
                log.info("신고 처리 성공. 신고 번호: {}", reportNo);
                return ResponseEntity.ok("신고가 성공적으로 처리되었습니다.");
            } else {
                log.warn("신고 처리 실패 또는 이미 처리된 신고. 신고 번호: {}", reportNo);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("신고를 처리할 수 없거나 이미 처리된 항목입니다.");
            }
        } catch (Exception e) {
            log.error("신고 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류로 인해 신고 처리에 실패했습니다.");
        }
    }
    
    /** 그룹화된 신고 목록 조회
     * @author BAEBAE
     * @param criteria 검색 조건 (query string으로 받음)
     * @return JSON 형태의 목록 데이터
     */
    @GetMapping("/report/group")
    public ResponseEntity<Map<String, Object>> getGroupedReportList(ReportSearchCriteria criteria) {
        Map<String, Object> result = adminReportService.getGroupedReports(criteria);
        return ResponseEntity.ok(result);
    }
    
    
    /** 신고 상세 정보 조회
     * @author BAEBAE
     * @param targetType
     * @param targetNo
     * @return
     */
    @GetMapping("/report/target/{targetType}/{targetNo}")
    public ResponseEntity<ReportDetailResponse> getReportDetails(
    		@PathVariable("targetType") String targetType,
            @PathVariable("targetNo") String targetNo) {
        ReportDetailResponse details = adminReportService.getReportDetailsByTarget(targetType, targetNo);
        if (details == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(details);
    }
    
    /** 제재 처리
     * @author BAEBAE
     * @param payload
     * @return
     */
    @PostMapping("/sanction")
    public ResponseEntity<String> sanctionTarget(@RequestBody Map<String, Object> payload) {
        try {
            adminReportService.processSanction(payload);
            return ResponseEntity.ok("정상적으로 제재 처리되었습니다.");
            
            // IllegalStateException을 별도로 잡아서 처리
        } catch (IllegalStateException e) {
            // [요청사항] 서비스에서 발생시킨 "이미 정지된..." 메시지를 클라이언트에게 전달
            log.warn("이미 처리된 제재 요청: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            
        } catch (Exception e) {
            log.error("제재 처리 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("제재 처리 중 오류가 발생했습니다.");
        }
    }

}
