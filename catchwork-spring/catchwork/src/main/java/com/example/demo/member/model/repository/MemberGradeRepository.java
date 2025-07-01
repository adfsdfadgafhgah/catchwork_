package com.example.demo.member.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.member.model.entity.MemberGradeEntity;

public interface MemberGradeRepository extends JpaRepository<MemberGradeEntity, Integer> {
    // 기본 CRUD 및 findById 사용 가능
}