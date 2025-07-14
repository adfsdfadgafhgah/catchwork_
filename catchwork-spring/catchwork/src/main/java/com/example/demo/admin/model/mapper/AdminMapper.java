package com.example.demo.admin.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.admin.model.dto.Admin;

@Mapper
public interface AdminMapper {
    Admin findByAdminId(String adminId);
}