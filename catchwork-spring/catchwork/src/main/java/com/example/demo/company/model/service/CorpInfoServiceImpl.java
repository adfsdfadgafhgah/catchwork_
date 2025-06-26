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
	@Override
	public List<CorpInfo> selectCorpList(String memNo) {
		return mapper.selectCorpList(memNo);
	}

	@Override
	public CorpInfo selectCorpDetail(int corpNo, String memNo) {
		return mapper.selectCorpDetail(corpNo, memNo);
	}

}
