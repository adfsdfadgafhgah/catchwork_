package com.example.demo.auth.model.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.CorpInfoEntity;

@Repository
public interface CorpInfoRepository extends JpaRepository<CorpInfoEntity, Long> {
    boolean existsByCorpRegNo(String corpRegNo);
    boolean existsByCorpCEOName(String corpCEOName);
    boolean existsByCorpOpenDate(LocalDate corpOpenDate);
    
    CorpInfoEntity findByCorpRegNo(String corpRegNo);

}
