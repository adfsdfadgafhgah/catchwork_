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
	 
	 
	 /**이력서 PDF 경로 다운로드
	  * @author JIN
	  * @param cvNo
	  * @return
	  */
	String getCVPDFPath(int cvNo);
	
	
	 /** 이력서 PDF 다운 체크
	  * @author JIN
	 * @param cvNo
	 */
	void markCVAsDownloaded(int cvNo);
	
}
