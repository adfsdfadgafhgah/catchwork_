package com.example.demo.corp.company.model.service;

import com.example.demo.corp.company.model.dto.CorpInfo;

public interface CorpInfoService {

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

	CorpInfo getCorpInfoByMemNo(String memNo);
	
}
