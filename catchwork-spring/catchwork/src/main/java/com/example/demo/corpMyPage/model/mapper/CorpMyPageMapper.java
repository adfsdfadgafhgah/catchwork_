package com.example.demo.corpMyPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.corpMyPage.model.dto.CorpMyPage;

@Mapper
public interface CorpMyPageMapper {
    CorpMyPage findCorpInfoById(String corpId);
}
