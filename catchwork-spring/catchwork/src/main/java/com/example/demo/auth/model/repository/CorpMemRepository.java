package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.model.entity.CorpMemEntity;

@Repository
public interface CorpMemRepository extends JpaRepository<CorpMemEntity, String> {

}
