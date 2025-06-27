package com.example.demo.company.model.service;

import java.util.List;
import com.example.demo.company.model.dto.CorpInfo;

public interface CorpInfoService {

	/**
	 * @author JIN
	 * @param memNo
	 * @return
	 */
	List<CorpInfo> selectCorpList(String memNo);

	/**
	 * @author JIN
	 * @param corpNo
	 * @param memNo
	 * @return
	 */
	CorpInfo selectCorpDetail(int corpNo, String memNo);

}
