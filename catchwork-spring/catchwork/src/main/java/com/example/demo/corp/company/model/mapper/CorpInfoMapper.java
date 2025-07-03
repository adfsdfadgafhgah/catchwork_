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
	    
}
