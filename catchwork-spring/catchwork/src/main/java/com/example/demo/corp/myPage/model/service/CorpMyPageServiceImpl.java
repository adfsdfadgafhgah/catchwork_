package com.example.demo.corp.myPage.model.service;

import org.springframework.stereotype.Service;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.mapper.CorpMyPageMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CorpMyPageServiceImpl implements CorpMyPageService {

    private final CorpMyPageMapper corpMyPageMapper;

    @Override
    public CorpMyPage getCorpInfoById(String corpId) {
        return corpMyPageMapper.findCorpInfoById(corpId);
    }
}
