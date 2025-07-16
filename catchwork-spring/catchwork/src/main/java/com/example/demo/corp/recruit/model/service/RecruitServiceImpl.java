package com.example.demo.corp.recruit.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.corp.recruit.model.mapper.RecruitMapper;

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
	public Recruit getRecruitDetail(int recruitNo, String memNo) {
		return recruitMapper.getRecruitDetail(recruitNo, memNo);
	}

	/** 채용공고 목록
	 * @author BAEBAE
	 */
	@Override
	public List<Recruit> getRecruitList(String status, String sort, String writer, String query, String memNo, Integer corpNo, String corpMemRoleCheck) {
		
		// 자동 마감 처리 (endDate < 오늘이면서 아직 status = 0인 공고들 → 3으로 바꾸기)
	    recruitMapper.autoCloseRecruit();
	    
		Map<String, Object> paramMap = new HashMap<>();
	    paramMap.put("status", status);
	    paramMap.put("sort", sort);
	    paramMap.put("writer", writer);
	    paramMap.put("query", query);
	    paramMap.put("memNo", memNo);
	    paramMap.put("corpNo", corpNo);
	    paramMap.put("corpMemRoleCheck", corpMemRoleCheck);
	    System.out.println("파라미터 맵: " + paramMap);

	    return recruitMapper.selectRecruitList(paramMap);
	}

	/** 채용공고 좋아요
	 * @author BAEBAE
	 */
	@Override
	public String toggleRecruitLike(String memNo, int recruitNo) {
		
		boolean exists = recruitMapper.checkRecruitLike(memNo, recruitNo);

	    if (exists) {
	        recruitMapper.deleteRecruitLike(memNo, recruitNo);
	        return "unliked";
	    } else {
	        recruitMapper.insertRecruitLike(memNo, recruitNo);
	        return "liked";
	    }
	}

	/** 채용공고 삭제
	 * @author BAEBAE
	 */
	@Override
	public boolean deleteRecruit(int recruitNo, String memNo) {
	    String writerNo = recruitMapper.findWriterByRecruitNo(recruitNo);

	    if (writerNo == null || !writerNo.equals(memNo)) {
	        return false; // 작성자가 아닌 경우 삭제 불가
	    }

	    int rows = recruitMapper.deleteRecruit(recruitNo, memNo);
	    return rows > 0;
	}

	/** 공고 마감처리
	 * @author BAEBAE
	 */
	@Override
	public boolean endRecruit(int recruitNo, String memNo) {
	    // 작성자 확인 후 맞으면 상태 업데이트
	    String writer = recruitMapper.findWriterByRecruitNo(recruitNo);
	    if (writer != null && writer.equals(memNo)) {
	        return recruitMapper.updateRecruitStatusToClosed(recruitNo) > 0;
	    }
	    return false;
	}

	/** 채용공고 수정
	 * @author BAEBAE
	 */
	@Override
	public int editRecruit(Recruit recruit) {
		return recruitMapper.editRecruit(recruit);
	}

	/** 채용공고 조회수 증가
	 * @author BAEBAE
	 */
	@Override
	public void recruitReadCount(int recruitNo) {
		recruitMapper.recruitReadCount(recruitNo);
	}

	/** 채용공고 삭제(스케줄러)
	 * @author JAEHO
	 */
	@Override
	public int removeTargetRecruit(int deleteTargetPeriod) {
		return recruitMapper.removeTargetRecruit(deleteTargetPeriod);
	}
}
