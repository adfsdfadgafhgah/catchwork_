package com.example.demo.auth.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.CorpInfo;
import com.example.demo.auth.model.entity.CorpInfoEntity;
import com.example.demo.auth.model.repository.CorpInfoRepository;

@Service
@Transactional(rollbackFor = Exception.class)
public class CorpServiceImpl implements CorpService {

	private final CorpInfoRepository corpInfoRepository;

	public CorpServiceImpl(CorpInfoRepository corpInfoRepository) {
		this.corpInfoRepository = corpInfoRepository;
	}

	@Override
	// 1. DB 중복 확인
	public boolean checkCorpRegNo(CorpInfo corp) {
		String regNo = corp.getCorpRegNo();
		boolean isValid = false;

		if (!corpInfoRepository.existsByCorpRegNo(regNo)) {
			return true; // 이미 등록된 번호
		}
		return isValid;
	}

	@Override
	// 2. 사업자 등록번호 유효성 검사
	public boolean authCorpRegNo(CorpInfo corp) {
		boolean isValid = true;
		
		return isValid;
	}

}