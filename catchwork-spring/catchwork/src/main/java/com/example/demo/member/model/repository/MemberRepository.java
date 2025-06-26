package com.example.demo.member.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.member.model.entity.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String>{

    // 회원가입 시 No / Id 중복 체크용
	Boolean existsByMemNo(String memNo);
	Boolean existsByMemId(String memId);

	// 로그인 시 사용자 조회용
	MemberEntity findByMemNo(String memNo);
	MemberEntity findByMemId(String memNo);
}
