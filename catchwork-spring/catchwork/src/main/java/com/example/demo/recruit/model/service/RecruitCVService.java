package com.example.demo.recruit.model.service;

import java.util.List;

import com.example.demo.recruit.model.dto.RecruitCV;

public interface RecruitCVService {
	
	/**전체조회
	 * @return
	 */
	List<RecruitCV> getAllRecruitCV();
	
	/** SELECT 조회
	 * @param edu(학력)
	 * @param career(경력)
	 * @return
	 */
	List<RecruitCV> getFilteredCV(String edu, String career);
	
	 /**이력서 PDF 바이너리 반환
	 * @param cvNo
	 * @return
	 */
	String getCvFilePath(int cvNo);

}
