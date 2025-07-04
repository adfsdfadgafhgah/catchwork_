package com.example.demo.corp.myPage.model.service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

public interface CorpMyPageService {
	
	// 로그인된 기업회원 마이페이지
    CorpMyPage getCorpMyPage(String corpId);
}
