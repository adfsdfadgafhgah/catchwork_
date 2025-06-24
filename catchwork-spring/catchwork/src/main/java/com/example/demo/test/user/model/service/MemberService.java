package com.example.demo.test.user.model.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.example.demo.test.user.model.dto.Member;

public interface MemberService {

	Object signup(Member inputMember);

//	String signin(Member inputMember); //LoginFilter에서 인증 처리?

}
