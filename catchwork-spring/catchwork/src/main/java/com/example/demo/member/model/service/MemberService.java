package com.example.demo.member.model.service;

import com.example.demo.member.model.dto.Member;

public interface MemberService {

	Object signup(Member inputMember);

	// 로그인 회원의 정보 조회
	Member getLoginMember(String memNo);

//	String signin(Member inputMember); //LoginFilter에서 인증 처리

}
