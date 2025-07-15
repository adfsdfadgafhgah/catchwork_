package com.example.demo.member.company.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.company.model.mapper.CompanyInfoMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CompanyInfoServiceImpl implements CompanyInfoService{

	@Autowired
	private CompanyInfoMapper companyInfoMapper;
	
		/**
		 *기업 목록 조회
		 *@author JIN
		 *@param query
		 *@param memNo
		 */
		@Override
		public List<CompanyInfo> selectCompanyList(String query, String memNo, Integer page,Integer size,String sort, Integer limit) {
//			log.info("전달된 query: {}, memNo: {}", query, memNo);
			Integer offset = null;
			if(page!=null) {
				offset = (page - 1) * size;				
			}
		    try {
		        List<CompanyInfo> result = companyInfoMapper.selectCompanyListWithRecruitInfo(query, memNo,offset,size,sort,limit);
//		        log.info("조회된 기업 수: {}", result != null ? result.size() : "null");
		        return result;
		    } catch (Exception e) {
		        log.error("getCorpList 에러 발생", e);
		        throw e;
		    }
		}

	/**
	 * 기업 상세인데 memNo에 따라 저장 표시가 다르게 보여짐
	 * @author JIN
	 * @param corpNo
     * @param memNo
	 */
	@Override
	public CompanyInfo selectCompanyDetail(int corpNo, String memNo) {
		log.info("corpNo: {}", corpNo);
		log.info(" memNo: {}", memNo);
		 CompanyInfo companyInfo = companyInfoMapper.selectCompanyDetail(corpNo, memNo);
		
		return companyInfoMapper.selectCompanyDetail(corpNo, memNo);
	}


	
}
