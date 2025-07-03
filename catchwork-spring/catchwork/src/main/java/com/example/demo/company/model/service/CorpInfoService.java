package com.example.demo.company.model.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.example.demo.company.model.dto.CorpInfo;

public interface CorpInfoService {

	
	
	
	/**
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<CorpInfo> selectCorpList(String query,String memNo);
	

	/**
	 * @author JIN
	 * @param corpNo
	 * @param memNo
	 * @return
	 */
	CorpInfo selectCorpDetail(int corpNo, String memNo);
	

}
