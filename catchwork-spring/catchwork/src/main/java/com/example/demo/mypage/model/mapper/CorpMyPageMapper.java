package com.example.demo.mypage.model.mapper;

import com.example.demo.mypage.model.dto.CorpMyPage;
import org.apache.ibatis.annotations.Mapper;
//import org.apache.ibatis.annotations.Select;

@Mapper
public interface CorpMyPageMapper {

    // 회원번호나 아이디 등을 기준으로 조회 가능하게
    CorpMyPage selectCorpMyPage(String corpId);
}