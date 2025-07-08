package com.example.demo.member.search.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;

public interface SearchService {
	
	/** select) recruit
	 * @author JIN
	 * @param query
	 * @param memNo
	 * @param status
	 * @param sort
	 * @return
	 */
	List<MemRecruit> searchRecruit(Map<String, Object> params);
	
	 /** select)company
	 * @author JIN
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<CompanyInfo> searchCompany(String query,String memNo);
	
}
