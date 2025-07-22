package com.example.demo.auth.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.CorpMemEntity;

@Repository
public interface CorpMemRepository extends JpaRepository<CorpMemEntity, String> {

    CorpMemEntity findByMemNo(String memNo);
    
    @Query("SELECT c.corpInfo.corpStatus FROM CorpMemEntity c WHERE c.memNo = :memNo")
    Optional<Integer> findCorpStatusByMemNo(@Param("memNo") String memNo);
}
