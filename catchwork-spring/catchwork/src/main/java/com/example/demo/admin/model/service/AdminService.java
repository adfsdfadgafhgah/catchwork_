package com.example.demo.admin.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.admin.model.dto.ReportList;

public interface AdminService {
	
    /** 최근 미처리 신고 목록 조회
     * @param startRow
     * @param endRow
     * @return
     * @author 민장
     */
	List<ReportList> selectRecentReportList(int startRow, int endRow);
    
	/** 최근 미처리 신고 개수 조회
	 * @return
	 * @author 민장
	 */
	Map<String, Object> selectRecentReportCount();
}
