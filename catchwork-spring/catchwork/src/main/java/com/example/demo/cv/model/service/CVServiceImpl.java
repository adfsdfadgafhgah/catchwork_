package com.example.demo.cv.model.service;

import org.springframework.stereotype.Service;

import com.example.demo.cv.model.mapper.CVMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class CVServiceImpl implements CVService {

	private final CVMapper mapper;
	
	
	@Override
	public void submitCV(String memNo, int cvNo, int recruitNo) {
		log.info("submitCV 서비스 호출 - memNo: {}, cvNo: {}, recruitNo: {}", memNo, cvNo, recruitNo);
		mapper.insertSubmitCV(memNo, cvNo, recruitNo);
	}

}
