package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String> {
    boolean existsByMemId(String memId);
    boolean existsByMemNickname(String memNickname);
    boolean existsByMemEmail(String memEmail);

    MemberEntity findByMemId(String memId);
    MemberEntity findByMemNo(String memNo);

    // 아이디 찾기
    MemberEntity findByMemNameAndMemEmail(String memName, String memEmail);

    // 비밀번호 찾기
    MemberEntity findByMemIdAndMemNameAndMemEmail(String memId, String memName, String memEmail);
}
