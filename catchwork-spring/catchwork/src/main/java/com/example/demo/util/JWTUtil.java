package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;

@Component
@PropertySource("classpath:/config.properties")
@Slf4j
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
    
    public String getNickname(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("nickname", String.class);
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
        try {
            return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
        } catch (ExpiredJwtException e) {
            // 토큰 만료
            return true;
        } catch (Exception e) {
            // 파싱 실패 (서명 오류 등) → 로그 후 false 반환 또는 예외 던지기 선택
            e.printStackTrace();
            return false;
        }
    }

	

	public String createJwt(String memNo, String memNickname, int memType, Long expiredMs) {
	    return Jwts.builder()
	        .claim("memNo", memNo)
	        .claim("memNickname", memNickname)
	        .claim("memType", memType)
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

    public boolean isValidToken(String token) {
        try {
            Jwts.parser().verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getExpiration()
            .before(new Date());
            return true;
        } catch (JwtException e) {
            log.debug("JWT 처리 중 오류 발생", e);
        } catch (Exception e) {
            log.debug("알 수 없는 예외 발생", e);
        }
        return false;
    }
}
        
        /*
        access 토큰 payload 구조
        {
          "memNo": "MinJang",				// String
          "memNickname": "미친_민장_180",	// String
          "memType": 1,						// int
          "iat": 1750842790,				// long
          "exp": 1750878790					// long
        }
        
        refresh 토큰 payload 구조
        {
          "memNo": "MinJang",			// String
          "iat": 1750842790,			// long
          "exp": 1750878790				// long
        }
        
        
         */