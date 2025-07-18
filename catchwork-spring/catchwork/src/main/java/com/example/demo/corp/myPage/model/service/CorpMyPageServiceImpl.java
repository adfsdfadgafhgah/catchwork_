package com.example.demo.corp.myPage.model.service;

import java.util.List;

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
    
    // 탈퇴하기
    @Override
    @Transactional
    public void withdrawCorpMember(String memNo) {
        String corpNo = corpMyPageMapper.getCorpNoByMemNo(memNo);
        String roleCheck = corpMyPageMapper.getRoleCheckByMemNo(memNo);

        if (corpNo == null) {
            throw new IllegalArgumentException("해당 회원의 기업 정보가 존재하지 않습니다.");
        }

        // 로그 출력
        System.out.println("💥 탈퇴 시작: memNo=" + memNo + ", roleCheck=" + roleCheck);
        System.out.println("📦 기업 번호: " + corpNo);

        if ("Y".equalsIgnoreCase(roleCheck)) {
            List<String> memNos = corpMyPageMapper.getMemNosByCorpNo(corpNo);
            System.out.println("🧑‍🤝‍🧑 탈퇴 대상 memNos: " + memNos);

            for (String memberNo : memNos) {
                corpMyPageMapper.withdraw(memberNo);
            }

            // 기업 상태 변경
            corpMyPageMapper.updateCorpInfoStatus(corpNo);
        } else {
            // 일반 구성원일 경우 본인만 탈퇴
            corpMyPageMapper.withdraw(memNo);
        }
    }
}