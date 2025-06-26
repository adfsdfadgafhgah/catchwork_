package com.example.demo.test.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.test.util.JWTUtil;
import com.example.demo.test.user.model.dto.CustomUserDetails;
import com.example.demo.test.user.model.entity.MemberEntity;

import io.jsonwebtoken.ExpiredJwtException;
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

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.split(" ")[1];

        try {
            if (jwtUtil.isExpired(token)) {
                // 로그만 출력하고 필터 체인 계속 진행
                System.out.println("Token expired");
                filterChain.doFilter(request, response);
                return;
            }
        } catch (ExpiredJwtException e) {
            System.out.println("Token parsing error: expired");
            filterChain.doFilter(request, response);
            return;
        }


        String username = jwtUtil.getMemId(token);
        int memType = jwtUtil.getMemType(token); // "0" or "1"
        
        MemberEntity member = new MemberEntity();
        member.setMemId(username);
        member.setMemPw("N/A");  // 비밀번호는 사용되지 않음
        member.setMemType(memType);
        
        CustomUserDetails customUserDetails = new CustomUserDetails(member);

        Authentication authToken =
            new UsernamePasswordAuthenticationToken(
                customUserDetails,
                null,
                customUserDetails.getAuthorities()
            );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

}
 