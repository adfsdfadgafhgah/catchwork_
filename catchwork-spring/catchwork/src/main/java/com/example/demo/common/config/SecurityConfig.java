package com.example.demo.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.test.filter.JWTFilter;
import com.example.demo.test.filter.LoginFilter;
import com.example.demo.test.jwt.util.JWTUtil;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final AuthenticationConfiguration authenticationConfiguration;
	private final UserDetailsService userDetailsService;
	private final JWTUtil jwtUtil;

	public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,
			UserDetailsService userDetailsService, JWTUtil jwtUtil) {
		this.authenticationConfiguration = authenticationConfiguration;
		this.userDetailsService = userDetailsService;
		this.jwtUtil = jwtUtil;
	}

	// 비밀번호 암호화
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// DaoAuthenticationProvider 설정
	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(bCryptPasswordEncoder());
		return authProvider;
	}

	// AuthenticationManager Bean
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	// LoginFilter Bean (AuthenticationManager 주입)
	@Bean
	public LoginFilter loginFilter() throws Exception {
		LoginFilter filter = new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil);
		// 로그인 성공/실패 URL 설정 (필요한 경우)
		return filter;
	}

	// 필터 체인
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		// cors
		http.cors((cors) -> {
		});

		// csrf disable
		http.csrf((auth) -> auth.disable());

		// From 로그인 방식 disable
		http.formLogin((auth) -> auth.disable());

		// http basic 인증 방식 disable
		http.httpBasic((auth) -> auth.disable());

		// 경로별 인가 작업
		http.authorizeHttpRequests((auth) -> auth
				/* 오류 발생 시, JWTFilter의 개입 방지&&정적 자원에 대한 필터의 개입 방지 */
				.requestMatchers("/error", "/favicon.ico", "/static/**", "/resources/**").permitAll()
				/* 로그인 및 관리자 서비스 미구현으로 인해 일괄 허용중 */
				.requestMatchers("/", "/signup", "/membership/**", "/tosspayment/**").permitAll()
				.requestMatchers("/admin").hasRole("ADMIN").anyRequest().authenticated());

		// LoginFilter
		http.addFilterAt(loginFilter(), UsernamePasswordAuthenticationFilter.class);
		// JWT 검증 필터
		http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

		// 세션 설정
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// 인증 및 권한 관련 예외 발생 시 JSON 형태로 응답을 반환하도록 설정
		http.exceptionHandling((exceptions) -> exceptions

				// 인증 실패 (예: JWT 없음, 만료 등) 시 401 Unauthorized 응답 처리
				.authenticationEntryPoint((request, response, authException) -> {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드 설정
					response.setContentType("application/json"); // 응답 타입을 JSON으로 지정
					response.getWriter().write("{\"error\": \"Unauthorized\"}"); // 간단한 JSON 에러 메시지 반환
				})

				// 접근 거부 (예: 권한 부족한 사용자가 ADMIN 경로 접근 등) 시 403 Forbidden 응답 처리
				.accessDeniedHandler((request, response, accessDeniedException) -> {
					response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 상태 코드 설정
					response.setContentType("application/json"); // 응답 타입을 JSON으로 지정
					response.getWriter().write("{\"error\": \"Forbidden\"}"); // 간단한 JSON 에러 메시지 반환
				}));

		return http.build();
	}
}