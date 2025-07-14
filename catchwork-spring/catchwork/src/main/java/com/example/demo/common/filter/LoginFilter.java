package com.example.demo.common.filter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.example.demo.auth.model.dto.CustomUserDetails;
import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.token.entity.RefreshTokenEntity;
import com.example.demo.auth.token.repository.RefreshTokenRepository;
import com.example.demo.common.util.JWTUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoginFilter extends AbstractAuthenticationProcessingFilter {

	private final ObjectMapper objectMapper = new ObjectMapper();
	private final JWTUtil jwtUtil;
	private final RefreshTokenRepository refreshTokenRepository;

	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
		super(new AntPathRequestMatcher("/signin", "POST"));
		setAuthenticationManager(authenticationManager);
		this.jwtUtil = jwtUtil;
	    this.refreshTokenRepository = refreshTokenRepository;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
	    System.out.println("LoginFilter 진입: 요청 수신");

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

//        String accessToken = jwtUtil.createJwt(username, memNickname, memType, 5 * 1000L); // 5 sec (test)
        String accessToken = jwtUtil.createJwt(username, memNickname, memType, 15 * 60 * 1000L);		// 15 min
        
//        String refreshToken = jwtUtil.createRefreshToken(username, 10 * 1000L);	// 10 sec (test)
        String refreshToken = jwtUtil.createRefreshToken(username, 7 * 24 * 60 * 60 * 1000L);	// 7 D

        // 만료 시간 계산해서 직접 삽입
//        LocalDateTime expiry = LocalDateTime.now().plusSeconds(10); // 10초 테스트용
        LocalDateTime expiry = LocalDateTime.now().plusDays(7); // 7일 유효
        
        RefreshTokenEntity tokenEntity = new RefreshTokenEntity(username, refreshToken, expiry);
        refreshTokenRepository.save(tokenEntity);
        
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
	    String message;
	    int status;

	    if (failed instanceof DisabledException) {
	        message = "탈퇴한 계정입니다.";
	        status = HttpServletResponse.SC_FORBIDDEN; // 403
	    } else if (failed instanceof LockedException) {
	        message = "정지된 계정입니다.";
	        status = HttpServletResponse.SC_FORBIDDEN; // 403
	    } else {
	        message = "아이디 또는 비밀번호가 올바르지 않습니다.";
	        status = HttpServletResponse.SC_BAD_REQUEST; // 400
	    }


	    response.setStatus(status);
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	
	    response.getWriter().write("{\"message\": \"" + message + "\"}");
        
    }
}


