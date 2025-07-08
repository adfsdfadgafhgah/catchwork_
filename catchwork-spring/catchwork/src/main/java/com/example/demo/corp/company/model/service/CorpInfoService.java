package com.example.demo.corp.company.model.service;

import java.util.Map;

import com.example.demo.corp.company.model.dto.CorpInfo;

public interface CorpInfoService {

	/** 공고 작성페이지에서 기업정보 가져오기
	 * @author BAEBAE
	 * @param memNo
	 * @return
	 */
	CorpInfo getCorpInfoByMember(String memNo);
	
	/** 기업 조회
	 * @author JIN
	 * @param memNo
	 * @return
	 */
	CorpInfo selectCorpDetailByMemNo(String memNo);
	
	/** 기업 정보 수정
	 * @author JIN
	 * @param corpInfo
	 * @return
	 */
	int updateCorpInfo(CorpInfo corpInfo);
	
//	Map<String, Object> selectCorpNoAndRoleCheck(String memNo);
	
	
}
