package com.example.demo.corp.myPage.model.mapper;

import java.util.List;

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
    
    // memNo로 CORP_NO 조회
    String getCorpNoByMemNo(String memNo);

    // memNo로 CORP_MEM_ROLE_CHECK 조회
    String getRoleCheckByMemNo(String memNo);

    // corpNo로 같은 기업 회원 memNo 리스트 조회
    List<String> getMemNosByCorpNo(String corpNo);
    

    // 회원 탈퇴 처리
    void withdraw(String memNo);

    // 기업 상태 변경(필요 시)
    void updateCorpInfoStatus(String corpNo);	
    
    // CORP_MEM_ROLE_CHECK = 'Y'인 경우, 해당 기업의 모든 회원 MEM_NO 조회
    List<String> findCorpMemberNosByMaster(String memNo);
      

}