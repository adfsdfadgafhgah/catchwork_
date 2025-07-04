package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.MemberEntity;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String> {
    boolean existsByMemId(String memId);
    boolean existsByMemNickname(String memNickname);

    MemberEntity findByMemId(String memId);
    MemberEntity findByMemNo(String memNo);
}
