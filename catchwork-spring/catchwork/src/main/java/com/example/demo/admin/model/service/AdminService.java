package com.example.demo.admin.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.admin.model.dto.Admin;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.SupportList;
import com.example.demo.admin.model.entity.AdminEntity;
import com.example.demo.support.model.dto.Support;

public interface AdminService {

	AdminEntity auth(Admin inputAdmin);

	Object register(Admin inputAdmin);

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

	/**
	 * 최근 7일 신고수 통계
	 * 
	 * @return
	 * @author 민장
	 */
	List<Map<String, Object>> selectRecentReportChart();

	/**
	 * 최근 7일 문의수 통계
	 * 
	 * @return
	 * @author 민장
	 */
	List<Map<String, Object>> selectRecentSupportChart();

}
