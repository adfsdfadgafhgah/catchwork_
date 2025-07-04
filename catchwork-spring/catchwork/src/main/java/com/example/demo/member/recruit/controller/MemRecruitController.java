package com.example.demo.member.recruit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.member.recruit.model.service.MemRecruitService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("memberRecruit")
@RequiredArgsConstructor
public class MemRecruitController {
	
private final MemRecruitService memRecruitService;
	
	
	/** 채용공고 상세
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	@GetMapping("detail/{recruitNo}")
    public ResponseEntity<?> getRecruitDetail(@PathVariable("recruitNo") int recruitNo, 
    										  @RequestParam(name = "memNo", required = false) String memNo ) {
		try {
	        Recruit recruit = memRecruitService.getRecruitDetail(recruitNo, memNo);
	        if (recruit != null) {
	            return ResponseEntity.ok(recruit);
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("공고를 찾을 수 없습니다.");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
	    }
    }
	
	/** 채용공고 목록
	 * @author BAEBAE
	 * @param status
	 * @param sort
	 * @param writer
	 * @param query
	 * @param memNo
	 * @return
	 */
	@GetMapping("list")
	public ResponseEntity<List<Recruit>> getRecruitList(
	    @RequestParam(name = "status", required = false, defaultValue = "all") String status,
	    @RequestParam(name = "sort", required = false, defaultValue = "latest") String sort,
	    @RequestParam(name = "writer", required = false, defaultValue = "all") String writer,
	    @RequestParam(name = "query", required = false) String query,
	    @RequestParam(name = "memNo", required = false) String memNo
	) {
	    List<Recruit> recruitList = memRecruitService.getRecruitList(status, sort, writer, query, memNo);
	    return ResponseEntity.ok(recruitList);
	}
	
	/** 채용공고 좋아요
	 * @param data
	 * @return
	 */
	@PostMapping("like")
	public ResponseEntity<Map<String, Object>> toggleRecruitLike(
	    @RequestBody Map<String, String> data
	) {
	    String memNo = data.get("memNo");
	    int recruitNo = Integer.parseInt(data.get("recruitNo"));

	    String result = memRecruitService.toggleRecruitLike(memNo, recruitNo);

	    Map<String, Object> response = new HashMap<>();
	    response.put("result", result); // "liked" or "unliked"
	    return ResponseEntity.ok(response);
	}
	
	
	/** 채용공고 조회수 증가
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	@GetMapping("recruitReadCount/{recruitNo}")
	public ResponseEntity<?> recruitReadCount(@PathVariable("recruitNo") int recruitNo) {
	    try {
	        memRecruitService.recruitReadCount(recruitNo);
	        return ResponseEntity.ok("조회수 증가 성공");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패");
	    }
	}

}
