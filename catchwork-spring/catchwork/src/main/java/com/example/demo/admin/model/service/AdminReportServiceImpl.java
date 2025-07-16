package com.example.demo.admin.model.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.ReportList;
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
		
		// 그룹화 된 신고 목록 조회 (배령)
		@Override
		public Map<String, Object> getGroupedReports(ReportSearchCriteria criteria) {
			// 1. 조건에 맞는 전체 그룹 개수를 먼저 조회 (페이지네이션 계산용)
	        int totalCount = adminReportMapper.getGroupedReportTotalCount(criteria);
	        
	        List<ReportList> list;
	        
	        // 신고 내역이 있을 때만 목록을 조회
	        if(totalCount > 0) {
	            // 2. 페이징 처리된 목록을 조회
	            list = adminReportMapper.getGroupedReportList(criteria);
	        } else {
	            // 신고 내역이 없으면 빈 목록을 반환
	            list = Collections.emptyList();
	        }
	        
	        // 3. 컨트롤러(프론트엔드)에 전달할 결과 Map 생성
	        Map<String, Object> result = new HashMap<>();
	        result.put("list", list);               // 현재 페이지의 목록 데이터
	        result.put("totalCount", totalCount);   // 전체 그룹 개수
	        
	        return result;
	    }

}
