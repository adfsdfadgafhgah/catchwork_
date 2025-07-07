package com.example.demo.corp.myPage.model.mapper;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CorpMyPageMapper {
    CorpMyPage findCorpInfoById(String corpId);
}
