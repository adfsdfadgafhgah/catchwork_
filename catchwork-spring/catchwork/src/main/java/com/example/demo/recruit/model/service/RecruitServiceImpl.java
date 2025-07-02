package com.example.demo.recruit.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.recruit.model.dto.Recruit;
import com.example.demo.recruit.model.mapper.RecruitMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class RecruitServiceImpl implements RecruitService {
	
	private final RecruitMapper recruitMapper;

	/** 채용공고 작성
	 * @author BAEBAE
	 */
	@Override
	public int writeRecruit(Recruit recruit) {
		
		return recruitMapper.writeRecruit(recruit);
		
	}

	/** 채용공고 상세
	 * @author BAEBAE
	 */
	@Override
	public Recruit getRecruitDetail(int recruitNo) {
		return recruitMapper.getRecruitDetail(recruitNo);
	}

}
