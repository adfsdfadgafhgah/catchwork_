package com.example.demo.report.model.service;

import com.example.demo.report.model.dto.Report;

public interface ReportService {
	
	// 신고
    int insertReport(Report report);
}
