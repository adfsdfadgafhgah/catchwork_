package com.example.demo.admin.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.support.model.dto.Support;
import com.example.demo.admin.model.dto.AdminReport;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.report.model.dto.Report;
import com.example.demo.admin.model.dto.SupportList;

public interface AdminService {

	/**
	 * 전체 문의 목록 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 * @param params
	 * @return
	 */
	List<Support> getAllSupportList(Map<String, Object> params);

	/**
	 * 특정 문의 상세 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 * @param supportNo
	 * @return
	 */
	Support getSupportDetail(int supportNo);

	/**
	 * 문의 답변 등록 (관리자용)
	 * 
	 * @param support
	 * @return
	 */
	int submitSupportAnswer(Support support);

	/**
	 * 최근 미처리 신고 목록 조회
	 * 
	 * @param startRow
	 * @param endRow
	 * @return
	 * @author 민장
	 */
	List<ReportList> selectRecentReportList(int startRow, int endRow);
	
	/**
	 * 최근 미처리 문의 목록 조회
	 * 
	 * @param startRow
	 * @param endRow
	 * @return
	 * @author 민장
	 */
	List<SupportList> selectRecentSupportList(int startRow, int endRow);
	
	/**
	 * 최근 미처리 신고 개수 조회
	 * 
	 * @return
	 * @author 민장
	 */
	Map<String, Object> selectRecentReportCount();
  
	/**
	 * 최근 미처리 문의 개수 조회
	 * 
	 * @return
	 * @author 민장
	 */
   Map<String, Object> selectRecentSupportCount();
  
	/** 신고 목록 조회
	 * @author BAEBAE
	 * @param criteria
	 * @return
	 */
	List<AdminReport> getReportList(ReportSearchCriteria criteria);

	/** 신고 요약 정보 조회
	 * @author BAEBAE
	 * @param criteria
	 * @return
	 */
	ReportSummary getReportSummary(ReportSearchCriteria criteria);

	/** 신고 처리 상태 변경
	 * @author BAEBAE
	 * @param reportToProcess
	 * @return
	 */
	int processReport(Report report);


}
