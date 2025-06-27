package com.example.demo.company.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.board.model.service.BoardService;
import com.example.demo.company.model.dto.CorpInfo;
import com.example.demo.company.model.service.CorpInfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("company")
public class CorpInfoController {

	@Autowired
	private CorpInfoService service;
	
	//controller가 잘 되는지 확인용 (지울거임)
	@GetMapping("debug")
	public ResponseEntity<?> debugTest() {
	    return ResponseEntity.ok("✅ 단순 문자열 응답 성공");
	}
	
	
	/**
     * 기업 목록 조회
     * ex)/company
     */
//	@GetMapping("")
//	public ResponseEntity<?> getCorpList(@RequestParam(required = false) String memNo) {

//		try {
//		    List<CorpInfo> corpList = service.selectCorpList(memNo);
//		    log.info("✅ 조회된 기업 수: {}", corpList.size());
//		    return ResponseEntity.ok(corpList);
//		} catch (Exception e) {
//		    log.error("❌ 기업 목록 조회 중 오류 발생", e); // 전체 스택 출력
//		    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//		                         .body("기업 목록 조회 중 오류 발생: " + e.getMessage());
//		}
//
//	}
	
	
	//name = "memNo"로 명시 해주니까 그래도 홈페이지는 뜸
	@GetMapping("")
	public ResponseEntity<?> getCorpList(@RequestParam(name = "memNo", required = false) String memNo) {
	    log.info("✅ /company 진입 성공");
	    
	    log.info("memNo 값 확인: {}", memNo);
	    try {
	        List<CorpInfo> corpList = service.selectCorpList(memNo);
	        return ResponseEntity.ok(corpList);
	    } catch (Exception e) {
	        log.error("기업 목록 조회 중 오류 발생", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("기업 목록 조회 중 오류 발생");
	    }
	}

    
//	  로그인한 멤버에 따라서 저장한 기업인지 아닌지 보여주기   
//    jwt 토큰
//    @GetMapping("")
//    public List<CorpInfo> getCorpList(HttpServletRequest request) {
//        Integer memNo = jwtUtil.extractMemNo(request); // JWT에서 추출
//        return service.selectCorpList(memNo);
//    }
    
    
    /**
     * 기업 상세 조회 
     * ex) /company/3
     */
    @GetMapping("{corpNo}")
    public ResponseEntity<?> getCorpDetail(@PathVariable int corpNo,
                                     @RequestParam(required = false) String memNo) {
       // return service.selectCorpDetail(corpNo, memNo);
    	try {
    		CorpInfo corpInfo = service.selectCorpDetail(corpNo, memNo);
    		return ResponseEntity.ok(corpInfo);
    	}catch(Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("기업 상세 조회중 오류발생");
    	}
    }
	
}
