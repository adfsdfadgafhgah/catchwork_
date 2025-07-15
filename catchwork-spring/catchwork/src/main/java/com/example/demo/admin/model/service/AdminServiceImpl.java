package com.example.demo.admin.model.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.mapper.AdminMapper;
import com.example.demo.report.model.dto.Report;
import com.example.demo.support.model.dto.Support;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.admin.model.dto.AdminReport;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper adminMapper;

	/** 전체 문의 목록 조회 (관리자용)
	 * @author BAEBAE
	 */
	@Override
	public List<Support> getAllSupportList(Map<String, Object> params) {
		return adminMapper.getAllSupportList(params);
	}

	/** 특정 문의 상세 조회 (관리자용)
	 * @author BAEBAE
	 */
	@Override
	public Support getSupportDetail(int supportNo) {
		return adminMapper.getSupportDetail(supportNo);
	}

	/** 문의 답변 등록 (관리자용)
	 * @author BAEBAE
	 */
	@Override
	public int submitSupportAnswer(Support support) {
		// 답변 등록 시 상태를 'Y'로 변경하고 답변 완료일 설정
		support.setSupportStatus("Y");
		support.setSupportAnswerDate(LocalDateTime.now()); // LocalDateTime 사용
		// adminNo는 Controller 또는 서비스 계층의 상위 로직에서 설정되어야 합니다.
		// 이 메서드가 호출될 때는 support.getAdminNo()에 값이 이미 설정되어 있어야 합니다.
		return adminMapper.submitSupportAnswer(support);

	}

	// 최근 미처리 신고 목록 조회 (민장)
	@Override
	public List<ReportList> selectRecentReportList(int startRow, int endRow) {
		Map<String, Object> param = new HashMap<>();
		param.put("startRow", startRow);
		param.put("endRow", endRow);
		return adminMapper.selectRecentReportList(param);
	}

	// 최근 미처리 신고 개수 조회 (민장)
	@Override
	public Map<String, Object> selectRecentReportCount() {
		return adminMapper.selectRecentReportCount();
	}
	
	// 신고 목록 조회 (배령)
	@Override
	public List<AdminReport> getReportList(ReportSearchCriteria criteria) {
		return adminMapper.getReportList(criteria);
	}
	
	// 신고 요약 정보 조회 (배령)
	@Override
	public ReportSummary getReportSummary(ReportSearchCriteria criteria) {
		return adminMapper.getReportSummary(criteria);
	}
	
	// 신고 처리 상태 변경 (배령)
	@Override
	public int processReport(Report report) {
		return adminMapper.updateReportStatusToComplete(report);
	}
}
