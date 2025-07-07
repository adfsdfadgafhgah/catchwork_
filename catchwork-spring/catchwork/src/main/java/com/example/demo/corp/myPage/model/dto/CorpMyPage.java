package com.example.demo.corp.myPage.model.dto;

import lombok.Data;

@Data
public class CorpMyPage {
    private String companyName;    // 기업명
    private String corpId;         // 기업 ID
    private String corpEmail;      // 이메일
    private String corpPhone;      // 전화번호
    private String corpName;       // 이름
    private String corpDepartment; // 부서명
}
