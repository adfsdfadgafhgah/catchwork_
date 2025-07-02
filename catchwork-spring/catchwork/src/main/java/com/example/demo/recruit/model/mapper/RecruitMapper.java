package com.example.demo.recruit.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.recruit.model.dto.Recruit;

@Mapper
public interface RecruitMapper {

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
