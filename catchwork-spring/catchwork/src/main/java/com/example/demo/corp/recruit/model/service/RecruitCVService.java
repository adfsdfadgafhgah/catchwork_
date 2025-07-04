package com.example.demo.corp.recruit.model.service;

import java.util.List;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

public interface RecruitCVService {
	
	/**이력서 전체 목록 조회
	 * @author JIN
	 * @return
	 */
	List<RecruitCV> getAllRecruitCV();
	
	/** 조건 필터링된 이력서 조회
	 * @author JIN
	 * @param edu(학력)
	 * @param career(경력)
	 * @return
	 */
	 List<RecruitCV> getCVList(RecruitCV filter);
	 
	 
	 /**이력서 PDF 다운(7/4 하는중)
	  * @author JIN
	  * @param cvNo
	  * @return
	  */
	String getCVFilePath(int cvNo);// 이거 아님
}
