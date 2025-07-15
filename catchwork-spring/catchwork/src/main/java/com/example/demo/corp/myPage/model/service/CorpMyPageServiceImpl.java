package com.example.demo.corp.myPage.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.mapper.CorpMyPageMapper;

@Service
public class CorpMyPageServiceImpl implements CorpMyPageService {

    @Autowired
    private CorpMyPageMapper corpMyPageMapper;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    @Override
    public CorpMyPage getCorpMyPage(String memNo) {
        try {
            return corpMyPageMapper.getCorpMyPage(memNo);
        } catch (Exception e) {
            e.printStackTrace();  // 예외 내용 출력
            throw e;  // 다시 던져서 500 에러 유지
        }
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