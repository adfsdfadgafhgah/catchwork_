// package com.example.demo.corp.myPage.model.service;
package com.example.demo.corp.myPage.model.service;

import com.example.demo.corp.myPage.model.dto.CorpMyPage;

public interface CorpMyPageService {

    /** corpId(기업 아이디)로 기업 마이페이지 정보 조회 */
    CorpMyPage getCorpInfoById(String corpId);
}	