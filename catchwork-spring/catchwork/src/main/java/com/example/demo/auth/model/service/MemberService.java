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

    // 아이디 찾기
    String findId(String memName, String memEmail, String corpRegNo, int memType);

    // 비밀번호 찾기
    Boolean findPw(String memId, String memName, String memEmail, int memType, String corpRegNo);

    // 이메일 존재 여부 확인
	boolean existEmail(String memEmail);
    
    // 이메일 인증번호 발송
    boolean sendEmail(String memEmail);

    // 이메일 인증번호 확인
    boolean checkAuthKey(String memEmail, String authKey);

    // 임시 비밀번호 발송
    boolean sendTempPw(String memEmail, String memId, String memName);

    // 탈퇴 회원 처리(스케줄러)
    int withdrawMember(int deleteTargetPeriod);

    // 이미지 처리(스케줄러)
    int deleteUnusedImage();

    // 이메일 인증번호 삭제(스케줄러)
    int removeTargetEmailAuth(int deleteTargetPeriod);
}
