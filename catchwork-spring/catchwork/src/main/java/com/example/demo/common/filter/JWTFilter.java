package com.example.demo.common.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.util.JWTUtil;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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

        String path = request.getRequestURI();
        String method = request.getMethod();

        // 요청 로그
        System.out.println("[JWTFilter] 요청 URI: " + path + " / method: " + method);

        // Authorization 헤더 확인
        String authorization = request.getHeader("Authorization");
        // debug
//        System.out.println("[JWTFilter] Authorization 헤더: " + authorization);

        // Authorization 헤더가 없거나 "Bearer "로 시작하지 않으면 필터 건너뜀(유효성 검사)
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("[JWTFilter] 토큰 없음 → 다음 필터로 진행");
            filterChain.doFilter(request, response);
            return;
        }
        
        // "Bearer [토큰]"에서 토큰만 분리
        String token = authorization.split(" ")[1];
        try {
        	// accessToken 만료되었는지 확인
            if (jwtUtil.isExpired(token)) {
                System.out.println("[JWTFilter] Token expired");

                // refreshToken 쿠키 확인
                boolean hasRefreshToken = false;
                Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (Cookie cookie : cookies) {
                        if ("refreshToken".equals(cookie.getName())) {
                            hasRefreshToken = true;
                            break;
                        }
                    }
                }

                if (hasRefreshToken) {
                    System.out.println("[JWTFilter] refreshToken 있음 → 401 응답 (재발급 유도)");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                } else {
                    System.out.println("[JWTFilter] refreshToken 없음 → 로그인 페이지로 리다이렉트");
                    response.sendRedirect("/signin"); // 필요시 변경
                }
                return;
            }
        } catch (Exception e) {
            System.out.println("[JWTFilter] Token parsing failed");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
 