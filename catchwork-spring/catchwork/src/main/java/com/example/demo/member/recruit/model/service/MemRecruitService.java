package com.example.demo.member.recruit.model.service;

import java.util.List;
import java.util.Map;

import com.example.demo.corp.recruit.model.dto.Recruit;

public interface MemRecruitService {
	
	/** 채용공고 상세
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	Recruit getRecruitDetail(int recruitNo, String memNo);

	/** 채용공고 목록
	 * @author BAEBAE
	 * @param status
	 * @param sort
	 * @param writer
	 * @param query
	 * @param memNo
	 * @return
	 */
	List<Recruit> getRecruitList(Map<String, Object> paramMap);

	/** 채용공고 좋아요
	 * @author BAEBAE
	 * @param memNo
	 * @param recruitNo
	 * @return
	 */
	String toggleRecruitLike(String memNo, int recruitNo);

	/** 채용공고 조회수 증가
	 * @author BAEBAE
	 * @param recruitNo
	 */
	void recruitReadCount(int recruitNo);

	/** 이력서 제출 여부 확인
	 * @author BAEBAE
	 * @param recruitNo
	 * @param memNo
	 * @return true - 이미 제출 / false - 미제출
	 */
	boolean checkSubmitCV(int recruitNo, String memNo);
}
