package com.example.demo.member.model.dto;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.member.model.entity.MemberEntity;

public class CustomUserDetails implements UserDetails {

    private final MemberEntity memberEntity;

    public CustomUserDetails(MemberEntity memberEntity) {

        this.memberEntity = memberEntity;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        int memType = memberEntity.getMemType(); // 예: 0=개인, 1=기업, 2=관리자 등
//        System.out.println(memType);
        String role = switch (memType) {
            case 0 -> "ROLE_USER";
            case 1 -> "ROLE_COMPANY";
            default -> "ROLE_USER";
        };

        authorities.add(() -> role);
        return authorities;
    }


    @Override
    public String getPassword() {
        return memberEntity.getMemPw();
    }

    @Override
    public String getUsername() {
        return memberEntity.getMemNo();
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