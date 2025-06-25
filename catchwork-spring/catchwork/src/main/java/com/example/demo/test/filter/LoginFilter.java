package com.example.demo.test.filter;

import java.io.IOException;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.example.demo.test.jwt.util.JWTUtil;
import com.example.demo.test.user.model.dto.CustomUserDetails;
import com.example.demo.test.user.model.dto.Member;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends AbstractAuthenticationProcessingFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        super(new AntPathRequestMatcher("/signin", "POST"));
        setAuthenticationManager(authenticationManager);
        this.jwtUtil = jwtUtil;
    }
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        try {
            // Content-Type이 application/json인지 확인
            String contentType = request.getContentType();
            if (contentType == null || !contentType.contains("application/json")) {
                throw new AuthenticationServiceException("Content-Type must be application/json");
            }

            // Request body에서 JSON 데이터 읽기
            String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));


            // JSON을 Member 객체로 변환
            Member member = objectMapper.readValue(requestBody, Member.class);

            String memId = member.getMemId();
            String memPw = member.getMemPw();

            // null 체크
            if (memId == null || memPw == null) {
                throw new AuthenticationServiceException("Username or password is null");
            }

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(memId, memPw);

            return this.getAuthenticationManager().authenticate(authToken);

        } catch (IOException e) {
            throw new AuthenticationServiceException("Failed to parse authentication request", e);
        }
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String username = customUserDetails.getUsername();

        // 권한 직접 추출 (memberEntity에서)
        String role = customUserDetails.getAuthorities().stream()
                                       .map(GrantedAuthority::getAuthority)
                                       .findFirst()
                                       .orElse("ROLE_USER"); // 기본값

        // JWT 생성
        String token = jwtUtil.createJwt(username, role, 60 * 60 * 10 * 1000L); // 10시간
        System.out.println("JWT 생성 완료: " + token);

        response.addHeader("Authorization", "Bearer " + token);
    }

    

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException {
    	
		//로그인 실패시 401 응답 코드 반환
        response.setStatus(401);
    }
}