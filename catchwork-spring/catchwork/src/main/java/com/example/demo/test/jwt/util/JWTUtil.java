package com.example.demo.test.jwt.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;

@Component
@PropertySource("classpath:/config.properties")
public class JWTUtil {

	private SecretKey secretKey;

	public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
		this.secretKey = new SecretKeySpec(
			secret.getBytes(StandardCharsets.UTF_8),
			Jwts.SIG.HS256.key().build().getAlgorithm()
		);
	}

	public String getMemId(String token) {
		return Jwts.parser().verifyWith(secretKey)
			.build().parseSignedClaims(token)
			.getPayload().get("memId", String.class);
	}
	
//	public String getMemName(String token) {
//		return Jwts.parser().verifyWith(secretKey)
//			.build().parseSignedClaims(token)
//			.getPayload().get("memName", String.class);
//	}

	public Boolean isExpired(String token) {
		return Jwts.parser().verifyWith(secretKey)
			.build().parseSignedClaims(token)
			.getPayload().getExpiration().before(new Date());
	}

	public String createJwt(String memId, String memName, Long expiredMs) {
		return Jwts.builder()
			.claim("memId", memId)
//			.claim("memName", memName)
			.issuedAt(new Date(System.currentTimeMillis()))
			.expiration(new Date(System.currentTimeMillis() + expiredMs))
			.signWith(secretKey)
			.compact();
	}
}
