package com.example.demo.auth.model.service;

import com.example.demo.auth.model.dto.Member;

public interface MemberService {

	// 아이디 중복확인
	boolean isIdAvailable(String memId);
	// 닉네임 중복확인
    boolean isNicknameAvailable(String nickname);
    
    //회원가입
    Object signup(Member inputMember) throws Exception;

    // 로그인 회원의 정보 조회
    Member getLoginMember(String memNo);
    
    Member getCorpLoginMember(String memNo);
}
