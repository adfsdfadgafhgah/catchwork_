package com.example.demo.member.company.model.service;

import java.util.List;
import com.example.demo.member.company.model.dto.CompanyInfo;

public interface CompanyInfoService {
	
	/** 기업 목록 조회 
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<CompanyInfo> selectCompanyList(String query,String memNo);
	

	/** 기업 상세 조회
	 * @author JIN
	 * @param corpNo
	 * @param memNo
	 * @return
	 */
	CompanyInfo selectCompanyDetail(int corpNo, String memNo);
	

}
