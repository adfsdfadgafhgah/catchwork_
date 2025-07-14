package com.example.demo.member.company.controller;

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

import com.example.demo.member.board.model.service.BoardService;
import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.company.model.service.CompanyInfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("company")
public class CompanyInfoController {

	@Autowired
	private CompanyInfoService companyInfoService;
    
    /**
     * 기업 정보 목록을 조회하는 API
     * @author JIN
     * @param query 검색어 (선택 사항)
     * @param memNo 회원번호 (선택 사항): 로그인 안해도 목록 조회 되어야 함
     * @return 기업 목록 리스트
     */
    @GetMapping("")
    public ResponseEntity<?> selectCompanyList(
    		@RequestParam(value = "query", required = false, defaultValue = "") String query,
    		@RequestParam(value = "memNo", required = false) String memNo,
            // 메인페이지용용
            @RequestParam(value = "sort", required = false, defaultValue = "likes") String sort,
            @RequestParam(value = "limit", required = false) Integer limit
            ) {
    	
    	//  log.info("기업 목록 조회 요청. 검색어: {}, memNo: {}", query, memNo);
    	 
        try {  
        	List<CompanyInfo> companyList = companyInfoService.selectCompanyList(query.trim(), memNo,sort,limit);
        
            if (companyList.isEmpty()) {
                // log.info("조회된 기업 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("기업 정보 없음");
            }
            // log.info("기업 목록 조회 성공. 총 {}개", companyList.size());
            return ResponseEntity.ok(companyList); // 200 OK
        } catch (Exception e) {
        	log.error("기업 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("기업 목록 조회 중 오류 발생");
        }
    }
    
    /** 기업 상세 조회
     * ex) company/3
     * @author JIN
     * @param corpNo
     * @param memNo
     * @return
     */
    @GetMapping("{corpNo}")
    public ResponseEntity<?> getCorpDetail(@PathVariable("corpNo") int corpNo,
    		  @RequestParam(value = "memNo", required = false) String memNo) {
    	log.info("corpNo: {}", corpNo); // 로그도 안 찍히면 진입도 안 한 것
    	log.info("memNo: {}", memNo);//못받는중임
    	try {
    		CompanyInfo corpInfo = companyInfoService.selectCompanyDetail(corpNo, memNo);
    		return ResponseEntity.ok(corpInfo);
    	}catch(Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("기업 상세 조회중 오류발생");
    	}
    }
}
