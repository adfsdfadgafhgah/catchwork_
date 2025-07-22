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
import com.example.demo.auth.model.entity.CorpMemEntity;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.repository.CorpInfoRepository;
import com.example.demo.auth.model.repository.CorpMemRepository;
import com.example.demo.auth.model.repository.MemberRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final CorpMemRepository corpMemRepository;
    private final CorpInfoRepository corpInfoRepository;
    
    public CustomUserDetailsService(MemberRepository memberRepository, CorpMemRepository corpMemRepository, CorpInfoRepository corpInfoRepository) {
        this.memberRepository = memberRepository;
        this.corpMemRepository = corpMemRepository;
        this.corpInfoRepository = corpInfoRepository;
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

        if (memberEntity.getMemType() == 1) {
            String memNo = memberEntity.getMemNo();
            CorpMemEntity corpMem = corpMemRepository.findByMemNo(memNo);

            int corpStatus = corpMemRepository.findCorpStatusByMemNo(memNo)
            	    .orElseThrow(() -> new DisabledException("소속 기업 정보가 없습니다."));
            
            if (corpStatus == 1) {
                throw new LockedException("소속 기업이 탈퇴 처리되었습니다.");
            } else if (corpStatus == 2) {
                throw new DisabledException("소속 기업이 정지된 상태입니다.");
            }
        }

        
        return new CustomUserDetails(memberEntity);
    }
}