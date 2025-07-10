package com.example.demo.corp.recruit.model.service;

import java.util.List;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

public interface RecruitCVService {
	
	/**우리 기업으로 들어온 이력서 전체 목록 조회
	 * @author JIN
	 * @return
	 */
	List<RecruitCV> getCVListByRecruitNo(int recruitNo);
	
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
	
	
	 /** 이력서 삭제
	 * @author JIN
	 * @param cvNos
	 */
	void deleteCVs(List<Integer> cvNos);
}
