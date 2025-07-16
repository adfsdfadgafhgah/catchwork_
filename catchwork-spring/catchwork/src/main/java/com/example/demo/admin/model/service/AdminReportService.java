package com.example.demo.admin.model.service;

import java.util.Map;

import com.example.demo.admin.model.dto.ReportDetailResponse;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.report.model.dto.Report;

public interface AdminReportService {
	
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

	/** 그룹화 된 신고 목록 조회
	 * @author BAEBAE
	 * @param criteria
	 * @return
	 */
	Map<String, Object> getGroupedReports(ReportSearchCriteria criteria);
	
    /** 신고 상세 정보 조회
     * @author BAEBAE
     * @param targetType
     * @param targetNo
     * @return
     */
    ReportDetailResponse getReportDetailsByTarget(String targetType, String targetNo);

    /** 제재 처리
     * @author BAEBAE
     * @param payload
     */
    void processSanction(Map<String, Object> payload);

}
