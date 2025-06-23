package com.example.demo.test.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.test.user.model.dto.Member;
import com.example.demo.test.user.model.service.MemberService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
public class MemberController {

//	@Autowired
	private final MemberService service;
	
	public MemberController(MemberService service) {
		this.service = service;
	}
	
	/**
	 * 회원가입 처리 메서드
	 * 
	 * @param inputMember 회원가입 정보가 담긴 Member 객체 (JSON 요청 바디)
	 * @return 회원가입 성공 시 메시지, 실패 시 에러 메시지를 JSON 형태로 반환
	 * 
	 * @author Won
	 */
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody Member inputMember) {
	    try {
	        Object result = service.signup(inputMember);
	        
	        // String 반환 시 에러 처리
	        if (result instanceof String) {
	            String errorCode = (String) result;
	            String message = getSignupErrorMessage(errorCode);
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                    .body(Map.of("message", message));
	        }
	        
	        // Member 반환 시 성공 처리
	        if (result instanceof Member) {
	            return ResponseEntity.ok(Map.of("message", "회원가입 성공", "user", result));
	        }
	        
	        // 예상치 못한 반환값 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("message", "알 수 없는 오류가 발생했습니다."));
	                
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "회원가입 실패", "details", e.getMessage()));
	    }
	}



	/**
	 * 로그인 처리 메소드
	 *
	 * @param inputMember 요청 바디에서 전달되는 로그인 정보(아이디, 비밀번호)
	 * @param request HTTP 요청 객체 (이전 페이지 세션에서 조회용)
	 * @param response HTTP 응답 객체 (아이디 저장 쿠키 설정용)
	 * @param session 세션 객체 (이전 페이지 URL 저장 및 조회용)
	 * @param saveId 아이디 저장 여부 (옵션, 체크 시 쿠키에 아이디 저장)
	 * @return JWT 토큰과 이전 페이지 URL(있을 경우)을 포함한 JSON 응답 또는 오류 메시지
	 *
	 * @throws 예외 발생 시 500 내부 서버 오류 상태코드 및 예외 메시지 반환
	 *
	 * @author Won
	 */
	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody Member inputMember,
	                               HttpServletRequest request,
	                               HttpServletResponse response,
	                               HttpSession session,
	                               @RequestParam(value = "saveId", required = false) String saveId) {
	    try {
	        Object result = service.signin(inputMember);
	        
	        // 로그인 실패 처리
	        if (result instanceof String) {
	            String errorCode = (String) result;
	            String message = getSigninErrorMessage(errorCode);
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .body(Map.of("message", message));
	        }
	        
	        // 로그인 성공 처리 (JWT 토큰 반환)
	        if (result instanceof String && isValidJWT((String) result)) {
	            String token = (String) result;
	            
	            // 아이디 저장 쿠키 설정
	            setCookieForSaveId(response, inputMember.getMemId(), saveId);
	            
	            // 이전 페이지 가져오기 및 제거
	            String prevPage = (String) session.getAttribute("prevPage");
	            session.removeAttribute("prevPage");
	            
	            // 응답 JSON 구성
	            Map<String, Object> responseBody = createSigninResponse(token, prevPage);
	            
	            return ResponseEntity.ok(responseBody);
	        }
	        
	        // 예상치 못한 반환값 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("message", "로그인 처리 중 알 수 없는 오류가 발생했습니다."));
	                
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "로그인 중 예외 발생", "details", e.getMessage()));
	    }
	}
	
	/**
	 * JWT 토큰 유효성 간단 체크 (실제로는 더 복잡한 검증 필요)
	 */
	private boolean isValidJWT(String token) {
	    return token != null && token.contains(".");
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	


	
	
	
	/**
	 * 
	 * @param errorCode
	 * @return
	 */
	private String getSignupErrorMessage(String errorCode) {
	    switch (errorCode) {
	        case "DUPLICATE_ID":
	            return "이미 사용중인 아이디입니다.";
	        case "INVALID_INPUT":
	            return "입력값이 올바르지 않습니다.";
	        default:
	            return "회원가입 처리 중 오류가 발생했습니다.";
	    }
	}
	
	
	

	/**
	 * 로그인 에러 코드에 따른 메시지 반환
	 */
	private String getSigninErrorMessage(String errorCode) {
	    switch (errorCode) {
	        case "INVALID_INPUT":
	            return "아이디와 비밀번호를 모두 입력해주세요.";
	        case "USER_NOT_FOUND":
	        case "INVALID_PASSWORD":
	            return "아이디 또는 비밀번호가 일치하지 않습니다.";
	        default:
	            return "로그인 처리 중 오류가 발생했습니다.";
	    }
	}

	/**
	 * 아이디 저장 쿠키 설정
	 */
	private void setCookieForSaveId(HttpServletResponse response, String memId, String saveId) {
	    Cookie cookie = new Cookie("saveId", memId);
	    cookie.setPath("/");
	    if (saveId != null) {
	        cookie.setMaxAge(60 * 60 * 24 * 30); // 30일
	    } else {
	        cookie.setMaxAge(0); // 쿠키 삭제
	    }
	    response.addCookie(cookie);
	}

	/**
	 * 로그인 성공 응답 JSON 생성
	 */
	private Map<String, Object> createSigninResponse(String token, String prevPage) {
	    if (prevPage != null) {
	        return Map.of("token", token, "redirectUrl", prevPage);
	    } else {
	        return Map.of("token", token);
	    }
	}


}
