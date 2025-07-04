package com.example.demo.corp.myPage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;
import com.example.demo.corp.myPage.model.service.CorpMyPageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/corp")
@RequiredArgsConstructor
public class CorpMyPageController {

    private final CorpMyPageService corpMyPageService;

    @GetMapping("/mypage/{corpId}")
    public ResponseEntity<CorpMyPage> getCorpInfo(@PathVariable String corpId) {
    	CorpMyPage corpInfo = corpMyPageService.getCorpMyPage(corpId);
        return ResponseEntity.ok(corpInfo);
    }
}
