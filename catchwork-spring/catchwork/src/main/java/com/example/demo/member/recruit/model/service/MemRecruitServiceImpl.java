package com.example.demo.member.recruit.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.member.recruit.model.mapper.MemRecruitMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemRecruitServiceImpl implements MemRecruitService {

	private final MemRecruitMapper memRecruitMapper;

	/** 채용공고 상세
	 * @author BAEBAE
	 */
	@Override
	public Recruit getRecruitDetail(int recruitNo, String memNo) {
		return memRecruitMapper.getRecruitDetail(recruitNo, memNo);
	}

	/** 채용공고 목록
	 * @author BAEBAE
	 */
	@Override
	public List<Recruit> getRecruitList(Map<String, Object> paramMap) {
		
		// 자동 마감 처리 (endDate < 오늘이면서 아직 status = 0인 공고들 → 3으로 바꾸기)
	    memRecruitMapper.autoCloseRecruit();
	    
	    return memRecruitMapper.selectRecruitList(paramMap);
	}

	/** 채용공고 좋아요
	 * @author BAEBAE
	 */
	@Override
	public String toggleRecruitLike(String memNo, int recruitNo) {
		
		boolean exists = memRecruitMapper.checkRecruitLike(memNo, recruitNo);

	    if (exists) {
	        memRecruitMapper.deleteRecruitLike(memNo, recruitNo);
	        return "unliked";
	    } else {
	        memRecruitMapper.insertRecruitLike(memNo, recruitNo);
	        return "liked";
	    }
	}

	/** 채용공고 조회수 증가
	 * @author BAEBAE
	 */
	@Override
	public void recruitReadCount(int recruitNo) {
		memRecruitMapper.recruitReadCount(recruitNo);
	}
}
