package com.example.demo.auth.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.model.dto.CeoSignUpRequest;
import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.model.service.MemberService;
import com.example.demo.auth.model.service.TransactionService;
import com.example.demo.auth.token.entity.RefreshTokenEntity;
import com.example.demo.auth.token.repository.RefreshTokenRepository;
import com.example.demo.common.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class MemberController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
	private final MemberService service;
	private final TransactionService transactionService;
	
	public MemberController(
			MemberService service, 
			JWTUtil jwtUtil, 
			RefreshTokenRepository refreshTokenRepository,
			TransactionService transactionService) {	
		this.service = service;	
		this.jwtUtil = jwtUtil;
		this.refreshTokenRepository = refreshTokenRepository;
		this.transactionService = transactionService;
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
		System.out.println("signup controller");
	    try {
	        Object result = service.signup(inputMember);
//	        System.out.println(result);
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
	
	@PostMapping("/ceosignup")
	public ResponseEntity<?> registerCorpAndCeo(@RequestBody CeoSignUpRequest req) {
	    transactionService.registerCorpAndCeo(
	            req.getCorpInfo(),
	            req.getCeoMember(),
	            req.getCorpMem()
	        );
	    return ResponseEntity.ok("기업 및 대표자 등록 성공");
	}
	
	
	
	@PostMapping("/signout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
	    Cookie cookie = new Cookie("refreshToken", null);
	    cookie.setMaxAge(0);
	    cookie.setPath("/");
	    cookie.setHttpOnly(true);
	    cookie.setSecure(true);
	    response.addCookie(cookie);
	    return ResponseEntity.ok("로그아웃 성공");
	}
	
	/**
	 * 
	 * @param request
	 * @return
	 */
	@PostMapping("/reissue")
	public ResponseEntity<?> reissueToken(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("reissue controller");
		
	    // 쿠키에서 refreshToken 추출
	    String refreshToken = null;
	    if (request.getCookies() != null) {
	        for (Cookie cookie : request.getCookies()) {
	            if ("refreshToken".equals(cookie.getName())) {
	                refreshToken = cookie.getValue();
	                break;
	            }
	        }
	    }
	    
	    // refreshToken 유효성 검사
	    if (refreshToken == null || jwtUtil.isExpired(refreshToken)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired or missing");
	    }

	    // refreshToken에서 memNo 추출
	    String memNo = jwtUtil.getMemNo(refreshToken);
	    
	    // DB에서 저장된 refreshToken 조회 및 비교
	    Optional<RefreshTokenEntity> savedTokenOpt = refreshTokenRepository.findByMemNo(memNo);
	    System.out.println("DB refreshToken : "+savedTokenOpt);

	    // debug
	    System.out.println(savedTokenOpt.get().getRefreshToken());
	    System.out.println(refreshToken);
	    
	    // 뭐라고 해야할 까
	    if (savedTokenOpt.isEmpty() || !savedTokenOpt.get().getRefreshToken().equals(refreshToken)) {
	    	// 쿠키 삭제 (refreshToken 무효 처리)
	    	Cookie deleteCookie = new Cookie("refreshToken", null);
	    	deleteCookie.setHttpOnly(true);
	    	deleteCookie.setPath("/");
	    	deleteCookie.setMaxAge(0); // 즉시 만료
	    	response.addCookie(deleteCookie);
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
	    }
	    
	    // accessToken/refreshToken 재발급
	    Member member = service.getLoginMember(memNo);
	    String newAccessToken = jwtUtil.createJwt(
//		        member.getMemNo(), member.getMemNickname(), member.getMemType(), 5 * 1000L	// 5 sec (test)
		        member.getMemNo(), member.getMemNickname(), member.getMemType(), 15 * 60 * 1000L	// 15 min
	    );

	    // Refresh Token
//	    String newRefreshToken = jwtUtil.createRefreshToken(memNo, 10 * 1000L); // 10 sec (test)
	    String newRefreshToken = jwtUtil.createRefreshToken(memNo, 7 * 24 * 60 * 60 * 1000L); // 7D
	    // 만료 시간 계산해서 DB에 직접 삽입
//        LocalDateTime expiry = LocalDateTime.now().plusSeconds(10); // 10 sec (test)
        LocalDateTime expiry = LocalDateTime.now().plusDays(7); // 7일 유효
        
	    // DB 업데이트
	    RefreshTokenEntity updatedToken = new RefreshTokenEntity(memNo, newRefreshToken, expiry);
	    refreshTokenRepository.save(updatedToken);
	    
	    // 쿠키에 새 refreshToken 저장
	    Cookie cookie = new Cookie("refreshToken", newRefreshToken);
	    cookie.setHttpOnly(true);
	    cookie.setPath("/");
	    cookie.setMaxAge(7 * 24 * 60 * 60); // 7일
	    response.addCookie(cookie);
	    
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + newAccessToken);
        
        // 새 액세스 토큰 헤더에 추가하여 응답
        return ResponseEntity.ok().headers(headers).body("Access token reissued");
	}


	// token refresh 확인용
	@GetMapping("/check-token")
	public ResponseEntity<?> checkToken(@RequestHeader("Authorization") String authHeader) {
	    try {
	        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authorization header 누락"));
	        }

	        String token = authHeader.substring(7);
	        boolean valid = !jwtUtil.isExpired(token);

	        if (valid) {
	            return ResponseEntity.ok(Map.of("message", "유효함"));
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "만료됨"));
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "검증 실패", "error", e.getMessage()));
	    }
	}


    @GetMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestParam("memId") String memId) {
        boolean available = service.isIdAvailable(memId);
        return ResponseEntity.ok(Collections.singletonMap("available", available));
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam("nickname") String nickname) {
        boolean available = service.isNicknameAvailable(nickname);
        return ResponseEntity.ok(Collections.singletonMap("available", available));
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
	
		
	/** 로그인 회원의 정보 조회
	 * @param memNo
	 * @author JAEHO
	 */
	@PostMapping("member/getLoginMember")
	private ResponseEntity<Object> getLoginMember(@RequestBody Map<String, String> map) {
		String memNo = map.get("memNo");
//		System.out.println("memNo :" + memNo);
		try {
			Member loginMember = service.getLoginMember(memNo);
			if(loginMember!=null) {
//				System.out.println("loginMember.getMemEmail() : " + loginMember.getMemEmail());
				return ResponseEntity.status(200).body(loginMember);
			}
			return ResponseEntity.status(200).body("Failed to fetch loginMember");
		} catch (Exception e) {
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	/** 아이디 찾기
	 * @author JAEHO
	 * @param map
	 * @return
	 */
	@PostMapping("/member/findId")
	public ResponseEntity<?> findId(
	    @RequestParam("memName") String memName,
	    @RequestParam("memEmail") String memEmail,
	    @RequestParam("memType") int memType,
	    @RequestParam(value = "corpRegNo", required = false) String corpRegNo
	) {
		try {
			String memId = service.findId(memName, memEmail, corpRegNo, memType);
			if(memId != null) {
				return ResponseEntity.ok(memId);
			} else {
				return ResponseEntity.status(404).body(Map.of("message", "아이디 찾기 실패"));
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}

	/** 비밀번호 찾기
	 * @author JAEHO
	 * @param paramMap
	 * @return
	 */
	@PostMapping("/member/findPw")
	public ResponseEntity<?> findPw(
						@RequestParam("memId") String memId, 
						@RequestParam("memName") String memName, 
						@RequestParam("memEmail") String memEmail, 
						@RequestParam("memType") int memType, 
						@RequestParam(value = "corpRegNo", required = false, defaultValue = "") String corpRegNo) {

		try {
			Boolean isVerified = service.findPw(memId, memName, memEmail, memType, corpRegNo);
			if(isVerified) {
				return ResponseEntity.ok(true);
			} else {
				System.out.println("비밀번호 찾기 실패");
				return ResponseEntity.status(404).body(Map.of("message", "비밀번호 찾기 실패"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(e.getMessage());
		}
	}
	
	@PostMapping("member/existEmail")
	public ResponseEntity<?> existEmail(@RequestParam("memEmail") String memEmail){
		boolean existEmail = service.existEmail(memEmail);
		if(existEmail) {			
			return ResponseEntity.ok(Map.of("message", "true"));
		}
		return ResponseEntity.ok(Map.of("message", "false"));
	}

	/** 이메일 인증번호 발송
	 * @author JAEHO
	 * @param paramMap
	 * @return
	 */
	@PostMapping("/member/sendEmail")
	public ResponseEntity<?> sendEmail(@RequestBody Map<String, String> paramMap) {
		String memEmail = paramMap.get("memEmail");
		boolean result = service.sendEmail(memEmail);
		if(result) {
			return ResponseEntity.ok(Map.of("message", "인증번호가 발송되었습니다."));
		} else {
			return ResponseEntity.status(500).body(Map.of("message", "인증번호 발송 실패"));
		}
	}

	/** 이메일 인증번호 확인
	 * @author JAEHO
	 * @param paramMap
	 * @return
	 */
	@PostMapping("/member/checkAuthKey")
	public ResponseEntity<?> checkAuthKey(@RequestBody Map<String, String> paramMap) {
		String memEmail = paramMap.get("memEmail");
		String authKey = paramMap.get("authKey");

		boolean result = service.checkAuthKey(memEmail, authKey);
		if(result) {
			return ResponseEntity.ok(Map.of("message", "인증번호가 확인되었습니다."));
		} else {
			return ResponseEntity.status(404).body(Map.of("message", "인증번호가 확인되지 않았습니다."));
		}
	}

	/** 임시 비밀번호 발송
	 * @author JAEHO
	 * @param paramMap
	 * @return
	 */
	@PostMapping("/member/sendTempPw")
	public ResponseEntity<?> sendTempPw(@RequestBody Map<String, String> paramMap) {
		String memEmail = paramMap.get("memEmail");
		String memId = paramMap.get("memId");
		String memName = paramMap.get("memName");
		
		boolean result = service.sendTempPw(memEmail, memId, memName);
		if(result) {
			return ResponseEntity.ok(Map.of("message", "임시 비밀번호가 발송되었습니다."));
		} else {
			return ResponseEntity.status(500).body(Map.of("message", "임시 비밀번호 발송 실패"));
		}
	}
}
