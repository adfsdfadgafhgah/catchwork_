package com.example.demo.test.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.test.jwt.util.JWTUtil;
import com.example.demo.test.user.model.dto.CustomUserDetails;
import com.example.demo.test.user.model.entity.MemberEntity;

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
    	
    	String path = request.getRequestURI();
    	if (path.startsWith("/error") || path.equals("/favicon.ico")) {
    	    filterChain.doFilter(request, response);
    	    return;
    	}


        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.split(" ")[1];

        if (jwtUtil.isExpired(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getMemId(token);

        MemberEntity member = new MemberEntity();
        member.setMemId(username);
        member.setMemPw("N/A");  // 비밀번호는 사용되지 않음

        CustomUserDetails customUserDetails = new CustomUserDetails(member);

        // CustomUserDetails가 권한 포함하므로 따로 authorities 설정 불필요
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
 