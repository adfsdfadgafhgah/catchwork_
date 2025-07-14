package com.example.demo.admin.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.admin.model.dto.Admin;
import com.example.demo.support.model.dto.Support;

@Mapper
public interface AdminMapper {
    Admin findByAdminId(String adminId);

	/** 전체 문의 목록 조회 (관리자용)
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

	/** 문의 답변 등록 (관리자용)
	 * @author BAEBAE
	 * @param support
	 * @return
	 */
	int submitSupportAnswer(Support support);
}