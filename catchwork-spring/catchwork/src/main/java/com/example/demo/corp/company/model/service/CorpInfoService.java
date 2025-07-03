package com.example.demo.corp.company.model.service;

import com.example.demo.corp.company.model.dto.CorpInfo;

public interface CorpInfoService {

	/**
	 * @author JIN
	 * @param memNo
	 * @return
	 */
	CorpInfo selectCorpDetailByMemNo(String memNo);
	
	int updateCorpInfo(CorpInfo corpInfo);
	
}
