package com.example.demo.auth.model.service;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.repository.MemberRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;
    
    public CustomUserDetailsService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // DB에서 Id로 사용자 조회 (로그인 때 쓰임)
        MemberEntity memberEntity = memberRepository.findByMemId(username);
        
        if (memberEntity == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }
        if (memberEntity.getMemStatus() == 1) {
        	// 탈퇴
            throw new DisabledException("비활성화된 계정입니다.");
        } else if (memberEntity.getMemStatus() == 2) {
        	// 정지
            throw new LockedException("비활성화된 계정입니다.");
        }

        
        return new CustomUserDetails(memberEntity);
    }
}