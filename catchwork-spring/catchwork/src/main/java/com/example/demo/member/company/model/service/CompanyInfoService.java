package com.example.demo.member.company.model.service;

import java.util.List;
import com.example.demo.member.company.model.dto.CompanyInfo;

public interface CompanyInfoService {
	
	/** 기업 목록 조회 
	 * @author JIN
	 * @param query
	 * @param memNo
	 * 
	 * 메인페이지용 기찬 추가
	 * @param sort
	 * @param limit
	 * 
	 * @return
	 */
	List<CompanyInfo> selectCompanyList(String query,String memNo,Integer page,Integer size,String sort,Integer limit);
	

	/** 기업 상세 조회
	 * @author JIN
	 * @param corpNo
	 * @return
	 */
	CompanyInfo selectCompanyDetail(int corpNo, String memNo);
	

}
