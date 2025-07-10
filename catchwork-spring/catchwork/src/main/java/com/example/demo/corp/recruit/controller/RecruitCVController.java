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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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

		/**우리 기업으로 들어온 이력서 전체 목록 조회
		 * @author JIN
		 * @return
		 */
		@GetMapping("list")
		public ResponseEntity<?> getCVListByRecruitNo(@RequestParam("recruitNo") int recruitNo) {
		    try {
		        List<RecruitCV> list = service.getCVListByRecruitNo(recruitNo);
		        log.info("공고 번호 {} 에 대한 이력서 수: {}", recruitNo, list.size());
		        return ResponseEntity.ok(list);
		    } catch (Exception e) {
		        log.error("공고별 이력서 조회 오류", e);
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                             .body("공고별 이력서 조회 실패: " + e.getMessage());
		    }
		}

	    
	    /** 조건 필터링된 이력서 목록 조회
	     * @author JIN
	     * @param filter
	     * @return
	     */
	    @GetMapping("filter")
	    public ResponseEntity<?> getCVList(RecruitCV filter) {
	        try {
	        	 List<RecruitCV> filteredList = service.getCVList(filter);
	            log.info("필터링 결과 이력서 수: {}", filteredList.size());
	            return ResponseEntity.ok(filteredList);
	        } catch (Exception e) {
	            log.error("필터링된 이력서 조회 중 오류 발생", e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("필터링된 이력서 조회 실패: " + e.getMessage());
	        }
	    }

	    /** 이력서 PDF 경로 다운로드
	     * @author JIN
	     * @param cvNo
	     * @return
	     */
	    @GetMapping("download/{cvNo}")
	    public ResponseEntity<byte[]> downloadCV(@PathVariable("cvNo") int cvNo) {
	    	try {
	    		
	    		// 1. 파일 경로 조회 (DB에서 파일명 또는 전체 경로 조회)
	    		String filePath = service.getCVPDFPath(cvNo); // 예: /files/cv1234.pdf

	    		File file = new File(filePath);
	    		if (!file.exists()) {
	    			System.out.println("파일 없음: " + filePath); // 디버깅용 출력
	    			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    		}

	    		// 2. 파일명만 추출해서 다운로드 이름 지정
	    		String filename = file.getName();

	    		// 이력서 다운로드시 check 여부
	    		 service.markCVAsDownloaded(cvNo);
	    		
		        // 3. byte[]로 읽기
		        byte[] fileData = Files.readAllBytes(file.toPath());
		
		        // 4. 응답 헤더 설정
		        HttpHeaders headers = new HttpHeaders();
		        headers.setContentType(MediaType.APPLICATION_PDF);
		        headers.setContentDisposition(
		            ContentDisposition.builder("attachment")
		                              .filename(filename)
		                              .build());
		        return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
	    	} catch (Exception e) {
	    		e.printStackTrace();
	    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    	}
	    }
	    
	    /** 이력서 삭제
	     * @author JIN
	     * @param dto
	     * @return
	     */
	    @DeleteMapping("/delete")
	    public ResponseEntity<?> deleteCVs(@RequestBody RecruitCV dto) {
	        try {
	            List<Integer> cvNos = dto.getCvNos();
	            if (cvNos == null || cvNos.isEmpty()) {
	                return ResponseEntity.badRequest().body("삭제할 이력서가 없습니다.");
	            }
	            service.deleteCVs(cvNos);
	            return ResponseEntity.ok().build();
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
	        }
	    }




}
