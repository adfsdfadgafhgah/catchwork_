package com.example.demo.corp.myPage.model.service;

import org.springframework.stereotype.Service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.mapper.CorpMyPageMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CorpMyPageServiceImpl implements CorpMyPageService {

    private final CorpMyPageMapper corpMyPageMapper;

    // 로그인된 기업회원 마이페이지
    @Override
    public CorpMyPage getCorpMyPage(String corpId) {
        return corpMyPageMapper.findCorpInfoById(corpId);
    }
}
