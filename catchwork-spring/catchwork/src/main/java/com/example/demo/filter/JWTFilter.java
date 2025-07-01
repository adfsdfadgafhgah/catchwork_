package com.example.demo.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.member.model.dto.CustomUserDetails;
import com.example.demo.member.model.entity.MemberEntity;
import com.example.demo.util.JWTUtil;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JWTFilter extends OncePerRequestFilter{
	
	private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Authorization 헤더 추출
        String authorization = request.getHeader("Authorization");
        // Authorization 헤더가 없거나 "Bearer "로 시작하지 않으면 필터 건너뜀(유효성 검사)
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        // "Bearer [토큰]"에서 토큰만 분리
        String token = authorization.split(" ")[1];

        try {
            if (jwtUtil.isExpired(token)) {
                // 토큰이 만료되었는지 확인/로그만 출력하고 필터 체인 계속 진행
                System.out.println("Token expired");
                filterChain.doFilter(request, response);
                return;
            }
        } catch (ExpiredJwtException e) {
            System.out.println("Token parsing error: expired");
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰에서 사용자 정보 추출
        String username = jwtUtil.getMemNo(token);
        int memType = jwtUtil.getMemType(token); // "0" or "1"
        
        MemberEntity member = new MemberEntity();
        member.setMemNo(username);
        member.setMemPw(null);  // 비밀번호는 사용되지 않음
        member.setMemType(memType);
        
        CustomUserDetails customUserDetails = new CustomUserDetails(member);
        // 사용자 인증 객체(Authentication) 생성
        Authentication authToken =
            new UsernamePasswordAuthenticationToken(
                customUserDetails,
                null,
                customUserDetails.getAuthorities()
            );
        // SecurityContext에 인증 정보 저장 (로그인된 사용자로 인식됨)
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

}
 