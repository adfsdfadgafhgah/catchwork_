// package com.example.demo.corp.myPage.model.mapper;
package com.example.demo.corp.myPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

@Mapper
public interface CorpMyPageMapper {

    /** 아이디로 기업 마이페이지 조회 */    
    CorpMyPage findCorpInfoById(String memId);
}