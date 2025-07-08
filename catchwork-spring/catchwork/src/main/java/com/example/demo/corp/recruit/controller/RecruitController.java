package com.example.demo.corp.recruit.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.corp.recruit.model.service.RecruitService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("corpRecruit")
@RequiredArgsConstructor
public class RecruitController {
	
	private final RecruitService recruitService;
	
	
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
	            return ResponseEntity.ok(Map.of("success", true, "recruitNo", recruit.getRecruitNo()));
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
    public ResponseEntity<?> getRecruitDetail(@PathVariable("recruitNo") int recruitNo, 
    										  @RequestParam(name = "memNo", required = false) String memNo ) {
		try {
	        Recruit recruit = recruitService.getRecruitDetail(recruitNo, memNo);
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
	    @RequestParam(name = "memNo", required = false) String memNo,
	    @RequestParam(name = "corpNo", required = false) Integer corpNo
	) {
	    List<Recruit> recruitList = recruitService.getRecruitList(status, sort, writer, query, memNo, corpNo);
	    System.out.println("corpNo = " + corpNo);
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

	    String result = recruitService.toggleRecruitLike(memNo, recruitNo);

	    Map<String, Object> response = new HashMap<>();
	    response.put("result", result); // "liked" or "unliked"
	    return ResponseEntity.ok(response);
	}
	
	/** 채용공고 삭제
	 * @author BAEBAE
	 * @param recruitNo
	 * @param body
	 * @return
	 */
	@DeleteMapping("delete/{recruitNo}")
	public ResponseEntity<?> deleteRecruit(@PathVariable("recruitNo") int recruitNo,
	                                       @RequestBody Map<String, String> request) {
		String memNo = (String) request.get("memNo");

		boolean result = recruitService.deleteRecruit(recruitNo, memNo);
	    return ResponseEntity.ok(Collections.singletonMap("success", result));
	}
	
	
	/** 공고 마감처리
	 * @author BAEBAE
	 * @param recruitNo
	 * @param body
	 * @return
	 */
	@PutMapping("end/{recruitNo}")
	public ResponseEntity<?> endRecruit(@PathVariable("recruitNo") int recruitNo, @RequestBody Map<String, Object> body) {
	    String memNo = (String) body.get("memNo");
	    boolean result = recruitService.endRecruit(recruitNo, memNo);
	    if (result) {
	        return ResponseEntity.ok().build();
	    } else {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
	    }
	}
	
	/** 채용공고 수정
	 * @author BAEBAE
	 * @param recruitNo
	 * @param recruit
	 * @return
	 */
	@PutMapping("edit/{recruitNo}")
	public ResponseEntity<?> editRecruit(@PathVariable("recruitNo") int recruitNo, 
										 @RequestBody Recruit recruit) {
		System.out.println("수정 요청: recruitNo=" + recruitNo);
		System.out.println("DTO recruitNo=" + recruit.getRecruitNo());
		System.out.println("DTO memNo=" + recruit.getMemNo());
	    try {
	    	recruit.setRecruitNo(recruitNo); // 경로 변수로 넘어온 boardNo를 DTO에 주입
	        int result = recruitService.editRecruit(recruit);
	        if (result > 0) {
	            return ResponseEntity.ok("수정 성공");
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패");
	        }
	    } catch (Exception e) {
	    	e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("오류 발생");
	    }
	}
	
	/** 채용공고 조회수 증가
	 * @author BAEBAE
	 * @param recruitNo
	 * @return
	 */
	@GetMapping("recruitReadCount/{recruitNo}")
	public ResponseEntity<?> recruitReadCount(@PathVariable("recruitNo") int recruitNo) {
	    try {
	        recruitService.recruitReadCount(recruitNo);
	        return ResponseEntity.ok("조회수 증가 성공");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패");
	    }
	}
	
}
