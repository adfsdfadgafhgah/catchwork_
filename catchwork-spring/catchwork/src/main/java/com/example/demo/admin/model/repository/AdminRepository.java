package com.example.demo.admin.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.admin.model.entity.AdminEntity;


@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Integer>{
	Optional<AdminEntity> findByAdminId(String adminId);
	boolean existsByAdminEmail(String adminEmail);
}
