package com.example.demo.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.admin.model.service.AdminService;
import com.example.demo.support.model.dto.Support;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
	
	private final AdminService adminService;

    @GetMapping("/main")
    public String adminMain() {
        return "Welcome Admin!";
    }
    
    /** 전체 문의 목록 조회 (관리자용)
     * @author BAEBAE
     * @param status
     * @param sort
     * @param query
     * @return
     */
    @GetMapping("supportlist")
    public ResponseEntity<?> getAllSupportList(
    		@RequestParam(value = "status", defaultValue = "all") String status,
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
    
    /** 특정 문의 상세 조회 (관리자용)
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
    
    /** 문의 답변 등록 (관리자용)
     * @author BAEBAE
     * @param support 답변 내용 및 문의 번호가 포함된 Support DTO
     * @return 성공 여부
     */
    @PutMapping("/supportanswer")
    public ResponseEntity<?> submitSupportAnswer(@RequestBody Support support) {
        try {
        	
        	int AdminNo = 6; // 예시: 임시 관리자 번호를 1L로 설정
            support.setAdminNo(AdminNo);
        	int result = adminService.submitSupportAnswer(support);
            if (result > 0) {
                log.info("문의 답변 등록 성공. 문의 번호: {}", support.getSupportNo());
                return ResponseEntity.ok("답변이 성공적으로 등록되었습니다.");
            } else {
                log.warn("문의 답변 등록 실패. 문의 번호: {}", support.getSupportNo());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("답변 등록 실패");
            }
        } catch (Exception e) {
            log.error("문의 답변 등록 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 등록 중 오류가 발생했습니다.");
        }
    }
   
    
    
    
}
