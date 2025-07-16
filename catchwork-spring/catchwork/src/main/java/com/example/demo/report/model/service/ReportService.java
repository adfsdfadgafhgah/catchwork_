package com.example.demo.report.model.service;

import com.example.demo.report.model.dto.Report;

public interface ReportService {
	
	// 신고
    int insertReport(Report report);
    
    // 신고 중복
    boolean hasUserAlreadyReported(String reportTargetNo, String reportTargetType, String memNo);
}
