package com.example.demo.corp.myPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

@Mapper
public interface CorpMyPageMapper {

    void updateMemberInfo(CorpMyPage corpMyPage);

    String selectMemberPassword(int memNo);

    void changePw(CorpMyPage corpMyPage);

    void withdraw(int memNo);
}
