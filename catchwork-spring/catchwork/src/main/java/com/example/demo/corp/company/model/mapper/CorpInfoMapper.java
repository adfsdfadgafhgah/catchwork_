package com.example.demo.corp.company.model.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.corp.company.model.dto.CorpInfo;

@Mapper
public interface CorpInfoMapper {
	
		/** memNo 기반
		 * 기업회원이 본인의 기업 상세를 보는
		 * @author JIN
		 * @param memNo
		 * @return
		 */
		CorpInfo selectCorpByMemNo(@Param("memNo") String memNo);

		int updateCorpInfo(CorpInfo corpInfo);

		/** 공고 작성페이지에서 기업정보 가져오기
		 * @param memNo
		 * @return
		 */
		CorpInfo selectCorpInfoByMemNo(String memNo);
	    
}
