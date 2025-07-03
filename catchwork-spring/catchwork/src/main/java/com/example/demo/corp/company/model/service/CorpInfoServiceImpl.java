package com.example.demo.corp.company.model.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.corp.company.model.dto.CorpInfo;
import com.example.demo.corp.company.model.mapper.CorpInfoMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CorpInfoServiceImpl implements CorpInfoService{

	@Autowired
	private CorpInfoMapper mapper;
		
	/**
	 * memNo에 따라서 기업 정보가 다르니 다르게 보여져야 함
	 */
	@Override
	public CorpInfo selectCorpDetailByMemNo(String memNo) {
	    return mapper.selectCorpByMemNo(memNo);
	}

	@Override
    public int updateCorpInfo(CorpInfo corpInfo) {
        return mapper.updateCorpInfo(corpInfo);
    }
	
}
