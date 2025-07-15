package com.example.demo.admin.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.admin.model.dto.AdminReport;
import com.example.demo.admin.model.dto.ReportSearchCriteria;
import com.example.demo.admin.model.dto.ReportSummary;
import com.example.demo.report.model.dto.Report;

@Mapper
public interface AdminReportMapper {

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
	 * @param report
	 * @return
	 */
	int updateReportStatusToComplete(Report report);

}
