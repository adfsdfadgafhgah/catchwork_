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
	
	@Override
    public List<RecruitCV> getAllRecruitCV() {
        return mapper.selectAllRecruitCV();
    }

	@Override
	public String getCvFilePath(int cvNo) {
	    return mapper.selectCvFilePath(cvNo);
	}

	 @Override
	    public List<RecruitCV> getCvList(RecruitCV filter) {
	        return mapper.getCvList(filter); // ✅ 정확히 같은 이름 filter 사용
	    }
}
