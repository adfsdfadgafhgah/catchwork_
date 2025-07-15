package com.example.demo.auth.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.auth.model.entity.EmailAuthEntity;

public interface EmailAuthRepository extends JpaRepository<EmailAuthEntity, Long> {
  EmailAuthEntity findByAuthEmailAndAuthKey(String memEmail, String authKey);
}
