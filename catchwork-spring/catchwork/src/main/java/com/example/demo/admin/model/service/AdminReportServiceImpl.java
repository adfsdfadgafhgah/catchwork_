package com.example.demo.admin.model.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.AdminReport;
import com.example.demo.admin.model.dto.ReportDetailResponse;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.admin.model.dto.TargetInfo;
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
		
		// 상세 정보 조회 로직
	    @Override
	    public ReportDetailResponse getReportDetailsByTarget(String targetType, String targetNo) {
	        Map<String, Object> params = new HashMap<>();
	        params.put("targetType", targetType);
	        params.put("targetNo", targetNo);

	        TargetInfo targetInfo = adminReportMapper.getTargetInfo(params);
	        List<AdminReport> reports = adminReportMapper.getReportsByTarget(params);

	        if(targetInfo == null) {
	            return null; // 대상이 없으면 null 반환
	        }

	        return new ReportDetailResponse(targetInfo, reports);
	    }

	    // 제재 처리 로직
	    @Override
	    @Transactional(rollbackFor = Exception.class) // 모든 Exception 발생 시 롤백
	    public void processSanction(Map<String, Object> payload) {
	    	
	    	TargetInfo targetInfo = adminReportMapper.getTargetInfo(payload);
	    	
	    	if (targetInfo == null) {
	            throw new RuntimeException("제재 대상을 찾을 수 없습니다.");
	        }

	        // ⬇️ 추가: 2. 대상의 상태가 이미 2(정지)인지 확인합니다.
	        if (targetInfo.getStatus() == 2) {
	            // 이미 정지된 경우, 특정 예외를 발생시켜 컨트롤러에서 처리하도록 함
	            String targetType = (String) payload.get("targetType");
	            if ("MEMBER".equals(targetType)) {
	                 throw new IllegalStateException("이미 정지된 회원입니다.");
	            } else {
	                 throw new IllegalStateException("이미 정지된 콘텐츠입니다.");
	            }
	        }

	        // 3. 대상의 상태를 '2'(정지)로 변경
	        int updateResult = adminReportMapper.updateTargetStatus(payload);
	        if (updateResult == 0) {
	            throw new RuntimeException("제재 대상의 상태 변경에 실패했습니다.");
	        }

	        // 4. BAN 테이블에 제재 기록 삽입
	        int insertResult = adminReportMapper.insertBan(payload);
	        if (insertResult == 0) {
	            throw new RuntimeException("제재 기록 추가에 실패했습니다.");
	        }
	    }

}
