package com.example.demo.admin.model.service;

import com.example.demo.admin.model.dto.Admin;
import com.example.demo.admin.model.mapper.AdminMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminMapper.findByAdminId(username);

        if (admin == null) {
            throw new UsernameNotFoundException("관리자 없음");
        }

        UserBuilder builder = User.builder();
        builder.username(admin.getAdminId());
        builder.password(admin.getAdminPw());
        builder.roles("ADMIN"); // 관리자 권한

        return builder.build();
    }
}
