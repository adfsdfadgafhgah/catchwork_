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

		// csrf disable
		http.csrf((auth) -> auth.disable());

		// From 로그인 방식 disable
		http.formLogin((auth) -> auth.disable());

		// http basic 인증 방식 disable
		http.httpBasic((auth) -> auth.disable());

		// 경로별 인가 작업
		http.authorizeHttpRequests((auth) -> auth.requestMatchers("/", "/signup").permitAll().requestMatchers("/admin")
				.hasRole("ADMIN").anyRequest().authenticated());
		

		// LoginFilter 
		http.addFilterAt(loginFilter(), UsernamePasswordAuthenticationFilter.class);
		// JWT 검증 필터
        http.addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);
        

		// 세션 설정
		http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}
}