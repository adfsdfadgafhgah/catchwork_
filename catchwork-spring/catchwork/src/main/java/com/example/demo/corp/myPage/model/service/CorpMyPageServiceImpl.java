package com.example.demo.corp.myPage.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.mapper.CorpMyPageMapper;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CorpMyPageServiceImpl implements CorpMyPageService {

    @Autowired
    private CorpMyPageMapper corpMyPageMapper;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    @Override
    public CorpMyPage getCorpMyPage(String memNo) {
        return corpMyPageMapper.getCorpMyPage(memNo);
    }

    @Override
    @Transactional
    public void updateMemberInfo(CorpMyPage corpMyPage) {
        corpMyPageMapper.updateMemberCoreInfo(corpMyPage);
        corpMyPageMapper.updateCorporateMemberDepartment(corpMyPage);
    }

    @Override
    public String selectMemberPassword(String memNo) {
        return corpMyPageMapper.selectMemberPassword(memNo);
    }

    @Override
    public boolean verifyPassword(String memNo, String inputPassword) {
        String storedEncodedPassword = corpMyPageMapper.selectMemberPassword(memNo);

        if (passwordEncoder != null) {
            return passwordEncoder.matches(inputPassword, storedEncodedPassword);
        } else {
            System.out.println("경고: PasswordEncoder가 설정되지 않아 비밀번호를 평문으로 비교합니다.");
            return storedEncodedPassword != null && storedEncodedPassword.equals(inputPassword);
        }
    }
}