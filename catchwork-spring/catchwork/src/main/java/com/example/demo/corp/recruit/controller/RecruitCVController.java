package com.example.demo.corp.recruit.controller;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.corp.recruit.model.dto.RecruitCV;
import com.example.demo.corp.recruit.model.service.RecruitCVService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("corpcv")
public class RecruitCVController {
	
		@Autowired
	    private RecruitCVService service;

		//전체 목록 조회
		@GetMapping("list")
	    public ResponseEntity<?> getCvList() {
	        try {
	            log.info("[GET] /list - 전체 이력서 목록 조회 요청");
	            List<RecruitCV> list = service.getAllRecruitCV();
	            log.info("조회된 이력서 수: {}", list.size());
	            return ResponseEntity.ok(list);
	        } catch (Exception e) {
	            log.error("이력서 전체 조회 중 오류 발생", e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("이력서 조회 실패: " + e.getMessage());
	        }
	    }
	    
	    
	    
	 //필터링 목록 조회
	    @GetMapping("filter")
	    public ResponseEntity<?> getCvList(RecruitCV filter) {

	      

	        try {
	        	 List<RecruitCV> filteredList = service.getCvList(filter);
	            log.info("필터링 결과 이력서 수: {}", filteredList.size());
	            return ResponseEntity.ok(filteredList);
	        } catch (Exception e) {
	            log.error("필터링된 이력서 조회 중 오류 발생", e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("필터링된 이력서 조회 실패: " + e.getMessage());
	        }
	    }

	    
	    
	    
	    //이력서 다운로드
	    @GetMapping("/download/{cvNo}")
	    public ResponseEntity<byte[]> downloadCv(@PathVariable int cvNo) {
	    	try {
	    		// 1. 파일 경로 조회 (DB에서 파일명 또는 전체 경로 조회)
	    		String filePath = service.getCvFilePath(cvNo); // 예: /files/cv1234.pdf

	    		File file = new File(filePath);
	    		if (!file.exists()) {
	    			return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null);
	    		}

	    		// 2. 파일명만 추출해서 다운로드 이름 지정
	    		String filename = file.getName();

		        // 3. byte[]로 읽기
		        byte[] fileData = Files.readAllBytes(file.toPath());
		
		        // 4. 응답 헤더 설정
		        HttpHeaders headers = new HttpHeaders();
		        headers.setContentType(MediaType.APPLICATION_PDF);
		        headers.setContentDisposition(
		            ContentDisposition.builder("attachment")
		                              .filename(filename)
		                              .build()
		        		);

		        return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
	    	} catch (Exception e) {
	    		e.printStackTrace();
	    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    	}
	    }
	    

}
