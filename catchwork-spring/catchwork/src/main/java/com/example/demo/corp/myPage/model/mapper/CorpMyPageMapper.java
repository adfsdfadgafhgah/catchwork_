package com.example.demo.corp.myPage.model.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.example.demo.corp.myPage.model.dto.CorpMyPage;

@Mapper
public interface CorpMyPageMapper {

    // 기업 회원 정보 조회
    CorpMyPage getCorpMyPage(String memNo);

    // 회원(MEMBER) 테이블의 기본 정보를 수정
    void updateMemberCoreInfo(CorpMyPage corpMyPage);

    // 기업 회원(CORPORATE_MEMBER) 테이블의 부서명을 수정
    void updateCorporateMemberDepartment(CorpMyPage corpMyPage);

    // 멤버 비밀번호 조회	
    String selectMemberPassword(String memNo);

}