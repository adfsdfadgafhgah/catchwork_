package com.example.demo.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.AdminReport;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.admin.model.mapper.AdminReportMapper;
import com.example.demo.report.model.dto.Report;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AdminReportServiceImpl implements AdminReportService{
	
	@Autowired
	private AdminReportMapper adminReportMapper;
	
	// 신고 목록 조회 (배령)
		@Override
		public List<AdminReport> getReportList(ReportSearchCriteria criteria) {
			return adminReportMapper.getReportList(criteria);
		}
		
		// 신고 요약 정보 조회 (배령)
		@Override
		public ReportSummary getReportSummary(ReportSearchCriteria criteria) {
			return adminReportMapper.getReportSummary(criteria);
		}
		
		// 신고 처리 상태 변경 (배령)
		@Override
		public int processReport(Report report) {
			return adminReportMapper.updateReportStatusToComplete(report);
		}

}
