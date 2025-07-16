package com.example.demo.admin.model.dto;

import lombok.Data;

@Data
public class ReportSummary {
	private int totalReports;		// 총 신고 건수
	private int unprocessedCount;   // 미처리 건수
    private int uniqueTargets;      // 총 신고 대상 수

}
