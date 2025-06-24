package com.example.demo.test.user.model.dto;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.test.user.model.entity.MemberEntity;

public class CustomUserDetails implements UserDetails {

    private final MemberEntity memberEntity;

    public CustomUserDetails(MemberEntity memberEntity) {

        this.memberEntity = memberEntity;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> "ROLE_ADMIN"); // 고정 ADMIN 부여 (Entity에 role 없음)
        return collection;
    }

    @Override
    public String getPassword() {
        return memberEntity.getMemPw();
    }

    @Override
    public String getUsername() {
        return memberEntity.getMemId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public MemberEntity getMemberEntity() {
        return memberEntity;
    }
}