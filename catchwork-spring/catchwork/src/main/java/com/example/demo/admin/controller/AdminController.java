package com.example.demo.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.admin.model.dto.Admin;
import com.example.demo.admin.model.dto.ReportList;
import com.example.demo.admin.model.dto.SupportList;
import com.example.demo.admin.model.entity.AdminEntity;
import com.example.demo.admin.model.service.AdminService;
import com.example.demo.support.model.dto.Support;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

	@Autowired
	private AdminService adminService;

	/** 로그인
	 * @param inputAdmin
	 * @param response
	 * @return
	 */
	@PostMapping("auth")
	public ResponseEntity<?> authenticationAdmin(@RequestBody Admin inputAdmin, HttpServletResponse response) {
	    try {
	        AdminEntity admin = adminService.auth(inputAdmin);
	        
	        // 쿠키에 adminId 저장
	        Cookie cookie = new Cookie("adminId", admin.getAdminId());
	        cookie.setPath("/");              // 모든 경로에서 접근 가능
	        cookie.setHttpOnly(true);         // JS에서 접근 못하게 (보안)
	        cookie.setMaxAge(60 * 60);        // 유효시간 1시간
	        response.addCookie(cookie);       // 응답에 쿠키 추가
	        
	        return ResponseEntity.ok(Map.of(
	            "message", "Authentication Complete",
	            "adminId", admin.getAdminId(),
	            "adminNickname", admin.getAdminNickname()
	        ));
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	            .body(Map.of("error", e.getMessage()));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("error", "Authentication Failed", "details", e.getMessage()));
	    }
	}


	/** 회원가입
	 * @param inputAdmin
	 * @return
	 */
	@PostMapping("register")
	public ResponseEntity<?> registrationAdmin(@RequestBody Admin inputAdmin) {
		try {
			Object res = adminService.register(inputAdmin);
			return ResponseEntity.ok(Map.of("message", "Registraion Complete", "res", res));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Regitration Failed", "details", e.getMessage()));
		}
	}

	/** 로그인 여부
	 * @param adminId
	 * @return
	 * @author 민장
	 */
	@GetMapping("check")
	public ResponseEntity<?> checkAdmin(@CookieValue(value = "adminId", required = false) String adminId) {
	    if (adminId == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not logged in"));
	    }
	    return ResponseEntity.ok(Map.of("adminId", adminId));
	}
	
	/** 로그아웃
	 * @param response
	 * @return
	 * @author 민장
	 */
	@GetMapping("/logout")
	public ResponseEntity<?> logoutAdmin(HttpServletResponse response) {
	    Cookie cookie = new Cookie("adminId", null);
	    cookie.setPath("/");
	    cookie.setMaxAge(0); // 즉시 만료
	    response.addCookie(cookie);
	    return ResponseEntity.ok(Map.of("message", "Logout complete"));
	}
	
	/** 관리자 정보 조회
	 * @param adminId
	 * @return
	 * @author 민장
	 */
	@GetMapping("/info")
	public ResponseEntity<?> adminInfo(@CookieValue(value = "adminId", required = false) String adminId) {
	    if (adminId == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("error", "로그인 상태 아님"));
	    }

	    Admin admin = adminService.adminInfo(adminId);
	    if (admin == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(Map.of("error", "관리자 정보 없음"));
	    }

	    return ResponseEntity.ok(admin);
	}
	
	/**
	 * 최근 미처리 신고 목록 조회
	 * 
	 * @param page
	 * @param size
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentReportList")
	public List<ReportList> selectRecentReportList(@RequestParam("page") int page, @RequestParam("size") int size) {
		int startRow = (page - 1) * size + 1;
		int endRow = page * size;
		return adminService.selectRecentReportList(startRow, endRow);
	}

	/**
	 * 최근 미처리 문의 목록 조회
	 * 
	 * @param page
	 * @param size
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentSupportList")
	public List<SupportList> selectRecentSupportList(@RequestParam("page") int page, @RequestParam("size") int size) {
		int startRow = (page - 1) * size + 1;
		int endRow = page * size;
		return adminService.selectRecentSupportList(startRow, endRow);
	}

	/**
	 * 최근 미처리 신고 개수 조회
	 * 
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentReportCount")
	public Map<String, Object> selectRecentReportCount() {
		return adminService.selectRecentReportCount();
	}

	/**
	 * 최근 미처리 문의 개수 조회
	 * 
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentSupportCount")
	public Map<String, Object> selectRecentSupportCount() {
		return adminService.selectRecentSupportCount();
	}

	/**
	 * 최근 7일 신고수 통계
	 * 
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentReportChart")
	public List<Map<String, Object>> selectRecentReportChart() {
		return adminService.selectRecentReportChart();
	}

	/**
	 * 최근 7일 문의수 통계
	 * 
	 * @return
	 * @author 민장
	 */
	@GetMapping("recentSupportChart")
	public List<Map<String, Object>> selectRecentSupportChart() {
		return adminService.selectRecentSupportChart();
	}

	/**
	 * 전체 문의 목록 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 * @param status
	 * @param sort
	 * @param query
	 * @return
	 */
	@GetMapping("supportlist")
	public ResponseEntity<?> getAllSupportList(@RequestParam(value = "status", defaultValue = "all") String status,
			@RequestParam(value = "sort", defaultValue = "latest") String sort,
			@RequestParam(value = "query", required = false) String query) {
		try {
			// 파라미터를 Map에 달아 서비스로 전달
			Map<String, Object> params = new HashMap<>();
			params.put("status", status);
			params.put("sort", sort);
			params.put("query", query);

			List<Support> supportList = adminService.getAllSupportList(params);
			return ResponseEntity.ok(supportList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("문의 목록 조회에 실패했습니다");
		}
	}

	/**
	 * 특정 문의 상세 조회 (관리자용)
	 * 
	 * @author BAEBAE
	 * @param supportNo 문의 번호
	 * @return 문의 상세 정보
	 */
	@GetMapping("supportdetail/{supportNo}") // /admin/supportdetail/{supportNo}
	public ResponseEntity<?> getSupportDetail(@PathVariable("supportNo") int supportNo) {
		try {
			Support support = adminService.getSupportDetail(supportNo);
			if (support == null) {
				log.warn("문의 상세 조회 실패: 문의 번호 {}를 찾을 수 없습니다.", supportNo);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("문의를 찾을 수 없습니다.");
			}
			log.info("문의 상세 조회 성공. 문의 번호: {}", supportNo);
			return ResponseEntity.ok(support);
		} catch (Exception e) {
			log.error("문의 상세 조회 중 오류 발생: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("문의 상세 조회에 실패했습니다.");
		}
	}

	/**
	 * 문의 답변 등록 (관리자용)
	 * 
	 * @author BAEBAE
	 * @param support 답변 내용 및 문의 번호가 포함된 Support DTO
	 * @return 성공 여부
	 */
	@PutMapping("/supportanswer")
	public ResponseEntity<?> submitSupportAnswer(@RequestBody Support support) {
		try {

			int adminNo = 1; // 예시: 임시 관리자 번호를 1L로 설정
			support.setAdminNo(adminNo);
			int result = adminService.submitSupportAnswer(support);
			if (result > 0) {
				log.info("문의 답변 등록 성공. 문의 번호: {}", support.getSupportNo());
				return ResponseEntity.ok("답변이 성공적으로 등록되었습니다.");
			} else {
				log.warn("문의 답변 등록 실패. 문의 번호: {}", support.getSupportNo());
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("답변 등록 실패");
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("문의 답변 등록 중 오류 발생: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 등록 중 오류가 발생했습니다.");
		}
	}

}
