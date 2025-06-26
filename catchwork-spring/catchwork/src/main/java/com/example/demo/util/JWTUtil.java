package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
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

    public String getMemNo(String token) {
        return Jwts.parser()
        		.verifyWith(secretKey)
        		.build()
                .parseSignedClaims(token)
                .getPayload()
                .get("memNo", String.class);
    }
    
    public String getMemId(String token) {
        return Jwts.parser()
        		.verifyWith(secretKey)
        		.build()
                .parseSignedClaims(token)
                .getPayload()
                .get("memId", String.class);
    }

    public int getMemType(String token) {
        return Jwts.parser()
        		.verifyWith(secretKey)
        		.build()
                .parseSignedClaims(token)
                .getPayload()
                .get("memType", Integer.class);
    }

    public String getRole(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("role", String.class);
    }

    
    
	public Boolean isExpired(String token) {
		return Jwts.parser()
			.verifyWith(secretKey)
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.getExpiration()
			.before(new Date());
	}
	
	

	public String createJwt(String memNo, int memType, String role, Long expiredMs) {
	    return Jwts.builder()
	        .claim("memNo", memNo)
	        .claim("memType", memType)
	        .claim("role", role)
	        .issuedAt(new Date(System.currentTimeMillis()))
	        .expiration(new Date(System.currentTimeMillis() + expiredMs))
	        .signWith(secretKey)
	        .compact();
	}

	public String createRefreshToken(String memNo,Long expiredMs) {
		System.out.println("RefreshToken created");
	    return Jwts.builder()
	        .claim("memNo", memNo)
	        .issuedAt(new Date(System.currentTimeMillis()))
	        .expiration(new Date(System.currentTimeMillis() + expiredMs))
	        .signWith(secretKey)
	        .compact();
	}

/*
access 토큰 payload 구조
{
  "memNo": "MinJang",			// String
  "memType": 1,					// int
  "role": "ROLE_COMPANY",		// String
  "iat": 1750842790,			// long
  "exp": 1750878790				// long
}

refresh 토큰 payload 구조
{
  "memNo": "MinJang",			// String
  "iat": 1750842790,			// long
  "exp": 1750878790				// long
}


 */
	
}
