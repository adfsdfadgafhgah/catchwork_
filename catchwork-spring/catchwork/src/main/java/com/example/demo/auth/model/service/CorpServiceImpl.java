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
	public Object registerCorp(CorpInfo corp) {
		System.out.println("기업 등록 service");
		try {
			CorpInfoEntity entity = new CorpInfoEntity();
	        entity.setCorpName(corp.getCorpName());
	        entity.setCorpRegNo(corp.getCorpRegNo());
	        entity.setCorpCEOName(corp.getCorpCEOName());
	        entity.setCorpAddr(corp.getCorpAddr());
	        entity.setCorpBM(corp.getCorpBM());
	        entity.setCorpBenefit(corp.getCorpBenefit());
	        entity.setCorpBenefitDetail(corp.getCorpBenefitDetail());
	        entity.setCorpDetail(corp.getCorpDetail());
	        entity.setCorpHomeLink(corp.getCorpHomeLink());
	        entity.setCorpLogoPath(corp.getCorpLogo());
	        entity.setCorpOpenDate(corp.getCorpOpenDate());
	        entity.setCorpType(corp.getCorpType());
			corpInfoRepository.save(entity);
			return entity;
		} catch (Exception e) {
			System.out.println(e);
			throw new RuntimeException("기업 등록 중 오류 발생", e);		
		}
	}

	@Override
	public boolean checkCorpRegNo(CorpInfo corp) {
		// 사업자등록번호 검증 로직 또는 외부 API 호출
		// 1. 이미 있는 사업자 등록번호 인가? 
		// 2. 유효한 사업자 등록번호인가?
		System.out.println("서비스 계층 사업자번호 확인: " + corp);
		return true; // 임시로 TRUE 설정해 놓음오아예
	}
}