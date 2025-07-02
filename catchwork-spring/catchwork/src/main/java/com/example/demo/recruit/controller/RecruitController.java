package com.example.demo.recruit.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.recruit.model.dto.Recruit;
import com.example.demo.recruit.model.service.RecruitService;
import com.example.demo.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("recruit")
@RequiredArgsConstructor
public class RecruitController {
	
	private final RecruitService recruitService;
	private final JWTUtil jwtUtil;
	
	/** 채용공고 작성
	 * @author BAEBAE
	 * @param recruit
	 * @return
	 */
	@PostMapping("write")
	public ResponseEntity<?> writeRecruit(@RequestBody Recruit recruit) {
	    try {
	        int result = recruitService.writeRecruit(recruit);
	        if (result > 0) {
	            return ResponseEntity.ok(Map.of("success", true));
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록 실패");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
	    }
	}
	
	/** 채용공고 상세
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	@GetMapping("detail/{recruitNo}")
    public ResponseEntity<?> getRecruitDetail(@PathVariable("recruitNo") int recruitNo) {
        Recruit recruit = recruitService.getRecruitDetail(recruitNo);
        if (recruit != null) {
            return ResponseEntity.ok(recruit);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("공고를 찾을 수 없습니다.");
        }
    }
	
	

}
