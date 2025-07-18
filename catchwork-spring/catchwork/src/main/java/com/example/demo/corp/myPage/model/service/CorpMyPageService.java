package com.example.demo.corp.myPage.model.service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

public interface CorpMyPageService {
    // 기업 회원 정보 조회 - 파라미터 타입 String
    CorpMyPage getCorpMyPage(String memNo);

    // 기업 회원 정보 수정
    void updateMemberInfo(CorpMyPage corpMyPage);

    // 멤버 비밀번호 조회 - 파라미터 타입 String
    String selectMemberPassword(String memNo);

    // 비밀번호 확인
	boolean verifyPassword(String memNo, String inputPassword);
	
	// 탈퇴하기
	void withdrawCorpMember(String memNo);

}
