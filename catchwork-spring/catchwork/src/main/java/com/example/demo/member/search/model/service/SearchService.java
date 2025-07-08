package com.example.demo.member.search.model.service;

import java.util.List;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;

public interface SearchService {
	
	

	/** select) recruit
	 * @author JIN
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<MemRecruit> searchRecruit(String query, String memNo, String status, String sort);
	
	 /** select)company
	  * JIN
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<CompanyInfo> searchCompany(String query,String memNo);
	
}
