package com.example.demo.filter;

import java.io.IOException;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.example.demo.member.model.dto.CustomUserDetails;
import com.example.demo.member.model.dto.Member;
import com.example.demo.util.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
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
        String username = customUserDetails.getUsername();	// memNo 임
        String memNickname = customUserDetails.getMemberEntity().getMemNickname(); // 닉네임 추출

        int memType = customUserDetails.getMemberEntity().getMemType(); // memType 0 : 개인 / 1 : 기업
        String role = customUserDetails.getAuthorities().stream()
                                       .map(GrantedAuthority::getAuthority)
                                       .findFirst()
                                       .orElse("ROLE_USER");

//        SecurityContext <- token에 넣는걸로 해서 그냥 빠꾸
//        SecurityContextHolder.getContext().setAuthentication(authentication);
        
//        memType (int) + role (String) 모두 전달
        String accessToken = jwtUtil.createJwt(username, memNickname, memType, role, 15 * 60 * 1000L);		// 15분
//        System.out.println("JWT 생성 완료: " + accessToken);
//        System.out.println(username +" "+memType+" "+role);
        String refreshToken = jwtUtil.createRefreshToken(username, 7 * 24 * 60 * 60 * 1000L);	// 7일
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);			// JS에서 접근 불가
        
//		나중에 변경할 것 나중에 변경할 것 나중에 변경할 것 나중에 변경할 것 
        refreshCookie.setSecure(false);				// HTTPS에서만 전송
//		나중에 변경할 것 나중에 변경할 것 나중에 변경할 것 나중에 변경할 것 
        
        refreshCookie.setPath("/");					// 전체 경로 유효
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);	// 7일

        
        // 응답
        response.addCookie(refreshCookie);
        response.addHeader("Authorization", "Bearer " + accessToken);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
			response.getWriter().write("{\"message\": \"로그인 성공\"}");
		} catch (IOException e) {
			e.printStackTrace();
		}

    }


    

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException {
    	
		//로그인 실패시 401 응답 코드 반환
        response.setStatus(401);
        
    }
}