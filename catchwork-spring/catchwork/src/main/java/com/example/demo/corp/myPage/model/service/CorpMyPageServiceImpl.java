package com.example.demo.corp.myPage.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.mapper.CorpMyPageMapper;

@Service
public class CorpMyPageServiceImpl implements CorpMyPageService {

    @Autowired
    private CorpMyPageMapper corpMyPageMapper;

    @Override
    public void updateMemberInfo(CorpMyPage corpMyPage) {
        corpMyPageMapper.updateMemberInfo(corpMyPage);
    }

    @Override
    public String selectMemberPassword(int memNo) {
        return corpMyPageMapper.selectMemberPassword(memNo);
    }

    @Override
    public void changePassword(CorpMyPage corpMyPage) {
        corpMyPageMapper.changePw(corpMyPage);
    }

    @Override
    public void withdraw(int memNo) {
        corpMyPageMapper.withdraw(memNo);
    }
}
