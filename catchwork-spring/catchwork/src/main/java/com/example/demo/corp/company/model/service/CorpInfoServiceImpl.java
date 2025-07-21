package com.example.demo.corp.company.model.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.corp.company.model.dto.CorpInfo;
import com.example.demo.corp.company.model.mapper.CorpInfoMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CorpInfoServiceImpl implements CorpInfoService {

	@Autowired
	private CorpInfoMapper mapper;

	/**
	 * memNo에 따라서 기업 정보가 다르니 다르게 보여져야 함
	 * @author JIN
	 */
	@Override
	public CorpInfo selectCorpDetailByMemNo(String memNo) {
		return mapper.selectCorpByMemNo(memNo);
	}

	/**
	 * 기업 정보 수정
	 * @author JIN
	 */
	@Override
	public int updateCorpInfo(CorpInfo corpInfo) {
		return mapper.updateCorpInfo(corpInfo);
	}

	/**
	 * 공고 작성페이지에서 기업 정보 가져오기
	 * @author BAEBAE
	 */
	@Override
	public CorpInfo getCorpInfoByMember(String memNo) {

		return mapper.selectCorpInfoByMember(memNo);
	}
	
//	@Override
//	public Map<String, Object> selectCorpNoAndRoleCheck(String memNo) {
//	    return mapper.selectCorpNoAndRoleCheck(memNo);
//	}

}
