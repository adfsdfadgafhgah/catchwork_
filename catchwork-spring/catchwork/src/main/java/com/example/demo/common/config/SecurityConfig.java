package com.example.demo.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.test.jwt.LoginFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final AuthenticationConfiguration authenticationConfiguration;
    
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration) {
        this.authenticationConfiguration = authenticationConfiguration;
    }
    
    // 비밀번호 암호화
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // AuthenticationManager Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    
    // LoginFilter Bean (AuthenticationManager 주입)
    @Bean
    public LoginFilter loginFilter(AuthenticationManager authenticationManager) throws Exception {
        return new LoginFilter(authenticationManager);
    }
    
    // 필터 체인
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, LoginFilter loginFilter) throws Exception {
        
    	// cors
    	http.cors((cors) -> {});
    	
        // csrf disable
        http.csrf((auth) -> auth.disable());
        
        // From 로그인 방식 disable
        http.formLogin((auth) -> auth.disable());
        
        // http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());
        
        // 경로별 인가 작업
        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/", "/signin", "/signup").permitAll()
                .requestMatchers("/cv/**").permitAll() // 👈 이력서 API 허용
                .requestMatchers("/admin").hasRole("ADMIN")
                .anyRequest().authenticated());
        
        // LoginFilter 추가 (Bean으로 주입받은 것 사용)
        http.addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        
        // 세션 설정
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        return http.build();
    }
}