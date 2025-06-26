package com.example.demo.mypage.controller;

import com.example.demo.mypage.model.dto.CorpMyPage;
import com.example.demo.mypage.model.service.CorpMyPageService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/mypage")
public class CorpMyPageController {

    @Autowired
    private CorpMyPageService corpMyPageService;

    @GetMapping("/{companyId}")
    public CorpMyPage getCorpMyPage(@PathVariable("companyId") String companyId) {
        return corpMyPageService.getCorpMyPage(companyId);
    }
}
