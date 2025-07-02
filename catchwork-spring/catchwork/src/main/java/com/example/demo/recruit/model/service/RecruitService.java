package com.example.demo.recruit.model.service;

import com.example.demo.recruit.model.dto.Recruit;

public interface RecruitService {

	/** 채용공고 작성
	 * @author BAEBAE
	 * @param recruit
	 * @return
	 */
	int writeRecruit(Recruit recruit);

	/** 채용공고 상세
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	Recruit getRecruitDetail(int recruitNo);

}
