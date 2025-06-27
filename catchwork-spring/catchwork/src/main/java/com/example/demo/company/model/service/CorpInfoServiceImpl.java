package com.example.demo.company.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.company.model.dto.CorpInfo;
import com.example.demo.company.model.mapper.CorpInfoMapper;

@Service
public class CorpInfoServiceImpl implements CorpInfoService{

	@Autowired
	private CorpInfoMapper mapper;
	
	/**
	 * memNo가 저장한 기업이 포함된 기업공고 목록 보여주기
	 */
	@Override
	public List<CorpInfo> selectCorpList(String memNo) {
		return mapper.selectCorpList(memNo);
	}

	/**
	 * detail인데 memNo에 따라 저장 표시가 다르게 보여짐
	 */
	@Override
	public CorpInfo selectCorpDetail(int corpNo, String memNo) {
		return mapper.selectCorpDetail(corpNo, memNo);
	}
}
