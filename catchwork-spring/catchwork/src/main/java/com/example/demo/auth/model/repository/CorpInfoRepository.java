package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.CorpInfoEntity;

@Repository
public interface CorpInfoRepository extends JpaRepository<CorpInfoEntity, String> {
    boolean existsByCorpRegNo(String corpRegNo);
}
