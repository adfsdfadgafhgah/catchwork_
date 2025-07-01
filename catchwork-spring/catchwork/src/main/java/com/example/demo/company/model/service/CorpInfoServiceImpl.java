package com.example.demo.company.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.company.model.dto.CorpInfo;
import com.example.demo.company.model.mapper.CorpInfoMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CorpInfoServiceImpl implements CorpInfoService{

	@Autowired
	private CorpInfoMapper mapper;
	
	
	
	//3번째 시도
		@Override
		public List<CorpInfo> selectCorpList(String query, String memNo) {
		    log.info("📌 getCorpList 호출 - query: {}, memNo: {}", query, memNo);

		    try {
		        List<CorpInfo> result = mapper.selectCorpListWithRecruitInfo(query, memNo);
		        log.info("📌 조회된 기업 수: {}", result != null ? result.size() : "null");
		        return result;
		    } catch (Exception e) {
		        log.error("❌ getCorpList 에러 발생", e);
		        throw e;
		    }
		}
	

	/**
	 * detail인데 memNo에 따라 저장 표시가 다르게 보여짐
	 */
	@Override
	public CorpInfo selectCorpDetail(int corpNo, String memNo) {
		log.info("📌 corpNo: {}", corpNo);
		log.info("📌 memNo: {}", memNo);
		return mapper.selectCorpDetail(corpNo, memNo);
	}

	
	
	

	
}
