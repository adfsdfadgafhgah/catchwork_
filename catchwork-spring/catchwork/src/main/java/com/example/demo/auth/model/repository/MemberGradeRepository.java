package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.auth.model.entity.MemberGradeEntity;

public interface MemberGradeRepository extends JpaRepository<MemberGradeEntity, Integer> {
}