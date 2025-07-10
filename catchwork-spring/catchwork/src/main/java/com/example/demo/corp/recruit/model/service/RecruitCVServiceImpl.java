package com.example.demo.corp.recruit.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.corp.recruit.model.dto.RecruitCV;
import com.example.demo.corp.recruit.model.mapper.RecruitCVMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecruitCVServiceImpl implements RecruitCVService {

		@Autowired
		private RecruitCVMapper mapper;
	
		/** 우리 기업으로 들어온 이력서 전체 목록 조회
		 * @author JIN
		 */
		@Override
		public List<RecruitCV> getCVListByRecruitNo(int recruitNo) {
		    return mapper.getCVListByRecruitNo(recruitNo);
		}

		/** 조건 필터링된 이력서 조회
		 * @author JIN
		 */
		@Override
	    public List<RecruitCV> getCVList(RecruitCV filter) {
	        return mapper.getCVList(filter);
	    }
	 
		/** 이력서 PDF 경로 다운로드
		 * @author JIN
		 */
		@Override
		public String getCVPDFPath(int cvNo) {
		    return mapper.selectCVPDFPath(cvNo);// 실제 DB에서 경로 가져옴
		}
		
		/** 이력서 PDF 다운 체크
		 * @author JIN
		 */
		public void markCVAsDownloaded(int cvNo) {
		    mapper.updateCVCheckFlag(cvNo);
		}
		
		/** 이력서 삭제
		 *@author JIN
		 */
		@Override
	    public void deleteCVs(List<Integer> cvNos) {
	        if (cvNos == null || cvNos.isEmpty()) return;
	        mapper.deleteCVs(cvNos); 
	    }
}
