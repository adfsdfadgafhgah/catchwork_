package com.example.demo.company.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.company.model.dto.CorpInfo;

@Mapper
public interface CorpInfoMapper {
	
		/**
		 * @author JIN
		 * @return
		 */
		List<CorpInfo> selectCorpList(String memNo); // 전체 기업 목록 조회
		
		/**
		 * @author JIN
		 * @param corpNo
		 * @param memNo
		 * @return
		 */
		CorpInfo selectCorpDetail(int corpNo,String memNo); // 특정 기업 조회->detail로 가기 위한
	
}
