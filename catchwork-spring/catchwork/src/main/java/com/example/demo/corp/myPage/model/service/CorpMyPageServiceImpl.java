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
    @Transactional // 트랜잭션 처리
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

    @Override
    @Transactional // 탈퇴 로직 전체에 트랜잭션 적용
    public void withdrawCorpMember(String memNo) {
        // 1. memNo로 CORP_MEM_ROLE_CHECK 받아오기
        String corpMemRoleCheck = corpMyPageMapper.getRoleCheckByMemNo(memNo);

        if ("Y".equals(corpMemRoleCheck)) {
            // 2. 기업 대표인 경우 기업 탈퇴 진행
            // 2-1. memNo로 CORP_MEM에서 corpNo 받아오기
            String corpNo = corpMyPageMapper.getCorpNoByMemNo(memNo);
            
            if (corpNo != null) {
                // 2-2. corpNo로 CORP_INFO에서 CORP_STATUS = 1로 변경 (기업 비활성화)
                corpMyPageMapper.updateCorpInfoStatus(corpNo);

                /*
                // 2-3. corpNo로 CORP_MEM의 memNo를 LIST<STRING>으로 받아오기
                List<String> memNosInCorp = corpMyPageMapper.getMemNosByCorpNo(corpNo);

                // 2-4. 해당 기업의 모든 회원 MEMBER의 MEM_STATUS = 1로 변경 (회원 탈퇴 처리)
                for (String memberNo : memNosInCorp) {
                    corpMyPageMapper.withdraw(memberNo);
                }
                */
            } else {
                // corpNo를 찾을 수 없는 경우 (예외 처리 또는 로깅)
                throw new RuntimeException("기업 번호를 찾을 수 없습니다: " + memNo);
            }
        } else {
            // 3. 일반 기업 회원인 경우 단일 회원 탈퇴 진행
            corpMyPageMapper.withdraw(memNo);
        }
    }
}
