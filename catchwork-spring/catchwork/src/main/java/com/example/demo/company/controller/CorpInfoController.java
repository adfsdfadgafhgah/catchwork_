package com.example.demo.company.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.company.model.dto.CorpInfo;
import com.example.demo.company.model.service.CorpInfoService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("company")
public class CorpInfoController {

	@Autowired
	private CorpInfoService service;
	
	
	/**
     * 기업 목록 조회
     * ex)/company
     */
    @GetMapping("")
    public List<CorpInfo> getCorpList(@RequestParam(required = false) String memNo) {
        return service.selectCorpList(memNo);
    }

    
    
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
    public CorpInfo getCorpDetail(@PathVariable int corpNo,
                                     @RequestParam(required = false) String memNo) {
        return service.selectCorpDetail(corpNo, memNo);
    }
	
}
