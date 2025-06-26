package com.example.demo.test.user.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.test.user.model.entity.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String>{

    // 회원가입 시 Id 중복 체크용
	Boolean existsByMemId(String memId);

	// 로그인 시 사용자 조회용
	MemberEntity findByMemId(String memId);
}
