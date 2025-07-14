package com.example.demo.admin.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.support.model.dto.Support;

public interface AdminService {

	/** 관리자가 문의 목록 조회
	 * @author BAEBAE
	 * @param params
	 * @return
	 */
	List<Support> getAllSupportList(Map<String, Object> params);

	/** 특정 문의 상세 조회 (관리자용)
	 * @author BAEBAE
	 * @param supportNo
	 * @return
	 */
	Support getSupportDetail(int supportNo);

}
