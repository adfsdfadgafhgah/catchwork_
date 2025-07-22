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

	/**
	 * 우리 기업으로 들어온 이력서 전체 목록 조회
	 * @author JIN
	 */
	@Override
	public List<RecruitCV> getCVListByRole(String memNo) {
		log.info("[Service] getCVListByRole - memNo: {}", memNo);
		String role = mapper.getCorpRoleByMemNo(memNo);
		log.info("[Service] 기업 회원 권한: {}", role);

		if ("Y".equals(role)) {
			Integer corpNo = mapper.getCorpNoByMemNo(memNo);
			log.info("[Service] 기업 대표 - corpNo: {}", corpNo);

			List<RecruitCV> list = mapper.getCVListByCorpNo(corpNo);

			if (list == null) {
				log.error("[Service] mapper.getCVListByCorpNo() 결과가 null입니다!");
			} else {
				log.info("[Service] 이력서 개수: {}", list.size());
			}

			return list;
		} else {
			List<RecruitCV> list = mapper.getCVListByWriter(memNo);
			log.info("[Service] 일반 사원 - 이력서 개수: {}", list.size());
			return list;
		}
	}

	/** 회원번호로 기업번호 조회하기
	 *@author JIN
	 */
	@Override
	public Integer getCorpNoByMemNo(String memNo) {
		return mapper.getCorpNoByMemNo(memNo);
	}

	/**
	 * 조건 필터링된 이력서 조회
	 * @author JIN
	 */
	@Override
	public List<RecruitCV> getCVList(RecruitCV filter) {
		log.info("[Service] getCVList - corpNo={}, edu={}, minCareer={}, maxCareer={}", filter.getCorpNo(),
				filter.getRecruitCVEdu(), filter.getCareerMin(), filter.getCareerMax());

		List<RecruitCV> list = mapper.getCVList(filter);
		log.info("[Service] 필터 결과 이력서 수: {}", list.size());

		return list;
	}

	/**
	 * 이력서 PDF 경로 다운로드
	 * @author JIN
	 */
	@Override
	public String getCVPDFPath(int cvNo) {
		return mapper.selectCVPDFPath(cvNo);// 실제 DB에서 경로 가져옴
	}

	/**
	 * 이력서 PDF 다운 체크
	 * @author JIN
	 */
	public void markCVAsDownloaded(int cvNo) {
		mapper.updateCVCheckFlag(cvNo);
	}

	/**
	 * 이력서 삭제
	 * @author JIN
	 */
	@Override
	public void deleteCVs(List<Integer> cvNos) {
		if (cvNos == null || cvNos.isEmpty())
			return;
		mapper.deleteCVs(cvNos);
	}
}
