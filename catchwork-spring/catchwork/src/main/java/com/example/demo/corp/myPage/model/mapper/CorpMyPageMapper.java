package com.example.demo.corp.myPage.model.mapper;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CorpMyPageMapper {
	
	// 로그인된 기업회원 마이페이지
    CorpMyPage findCorpInfoById(String corpId);
}
