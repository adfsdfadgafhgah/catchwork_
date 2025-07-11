package com.example.demo.corp.myPage.model.service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

public interface CorpMyPageService {
    void updateMemberInfo(CorpMyPage corpMyPage);
    String selectMemberPassword(int memNo);
    void changePassword(CorpMyPage corpMyPage);
    void withdraw(int memNo);
}
