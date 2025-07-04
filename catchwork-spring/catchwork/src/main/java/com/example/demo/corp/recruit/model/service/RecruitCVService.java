package com.example.demo.corp.recruit.model.service;

import java.util.List;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

public interface RecruitCVService {
	
	/**전체조회
	 * @return
	 */
	List<RecruitCV> getAllRecruitCV();
	
	
	 /**이력서 PDF 바이너리 반환
	 * @param cvNo
	 * @return
	 */
	String getCvFilePath(int cvNo);

	/** SELECT 조회
	 * @param edu(학력)
	 * @param career(경력)
	 * @return
	 */
	 List<RecruitCV> getCvList(RecruitCV filter);  // ✨ 이 줄 추가
}
