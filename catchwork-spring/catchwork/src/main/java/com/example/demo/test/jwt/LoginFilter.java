package com.example.demo.test.jwt;

import java.io.IOException;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.example.demo.test.user.model.dto.Member;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends AbstractAuthenticationProcessingFilter {

	private final ObjectMapper objectMapper = new ObjectMapper();

	public LoginFilter(AuthenticationManager authenticationManager) {
		super(new AntPathRequestMatcher("/signin", "POST"));
		setAuthenticationManager(authenticationManager);
		System.out.println("loginfilter");
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

			System.out.println("Request Body: " + requestBody);

			// JSON을 Member 객체로 변환
			Member member = objectMapper.readValue(requestBody, Member.class);

			String memId = member.getMemId();
			String memPw = member.getMemPw();

			// 콘솔 출력 (디버깅용)
			System.out.println("로그인 시도 - ID: " + memId);
			System.out.println("로그인 시도 - PW: " + memPw);

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
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException {
		System.out.println("success");
		// 여기서 JWT 토큰 생성 및 응답 처리
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("{\"status\":\"success\",\"message\":\"Login successful\"}");
	}

	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) throws IOException {
		System.out.println("fail: " + failed.getMessage());
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("{\"status\":\"fail\",\"message\":\"" + failed.getMessage() + "\"}");
	}
}