package com.example.demo.auth.model.service;

import com.example.demo.auth.model.dto.CorpInfo;

public interface CorpService {
    boolean checkCorpRegNo(CorpInfo corp);
    boolean checkCorpCEOName(CorpInfo corp);
    boolean authCorpRegNo(CorpInfo corp);
	String findMemName(String memNo);

    /** 이미지 처리(스케줄러)
	 * @author JAEHO
	 * @return
	 */
	int deleteUnusedImage();

	/** 탈퇴 기업 처리(스케줄러)
	 * @author JAEHO
	 * @return
	 */
	int withdrawCompany(int deleteTargetPeriod);
}