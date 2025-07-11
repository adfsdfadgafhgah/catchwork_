package com.example.demo.corp.recruit.model.service;

import java.util.List;

import com.example.demo.corp.recruit.model.dto.RecruitCV;

public interface RecruitCVService {
	
	/**역할에 따른 이력서 목록 조회
	 * @author JIN
	 * @param memNo 
	 * @return 기업대표 : 전체이력서, 사원 : 본인 공고 이력서 리스트
	 */
	List<RecruitCV> getCVListByRole(String memNo);
	
	/** 조건 필터링된 이력서 조회
	 * @author JIN
	 * @param edu(학력)
	 * @param career(경력)
	 * @return 조건에 맞는 이력서 목록
	 */
	 List<RecruitCV> getCVList(RecruitCV filter);
	 
	 /** 회원번로 기업번호 조회하기
	  * @author JIN
	 * @param memNo
	 * @return 해당 memNo로 가입된corpNo
	 */
	Integer getCorpNoByMemNo(String memNo);
	 
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
