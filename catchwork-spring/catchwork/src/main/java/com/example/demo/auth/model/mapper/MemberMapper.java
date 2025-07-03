package com.example.demo.auth.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.auth.model.dto.Member;

@Mapper
public interface MemberMapper {

	// 로그인 회원의 정보 조회
	Member getLoginMember(String memNo);

}
