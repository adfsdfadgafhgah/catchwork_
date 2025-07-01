package com.example.demo.corpMyPage.model.service;

import org.springframework.stereotype.Service;

import com.example.demo.corpMyPage.model.dto.CorpMyPage;
import com.example.demo.corpMyPage.model.mapper.CorpMyPageMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CorpMyPageServiceImpl implements CorpMyPageService {

    private final CorpMyPageMapper corpMyPageMapper;

    @Override
    public CorpMyPage getCorpMyPage(String corpId) {
        return corpMyPageMapper.findCorpInfoById(corpId);
    }

}
