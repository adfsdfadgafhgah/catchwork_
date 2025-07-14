package com.example.demo.corp.myPage.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CorpMyPage {
    private String memNo;           // 멤버 넘버 (String)
    private String memId;           // 멤버 아이디
    private String memPw;           // 멤버 비번
    private String memName;         // 멤버 이름
    private String memEmail;        // 멤버 이메일
    private String memTel;          // 멤버 전화번호
    private String corpName;        // 기업 이름
    private String corpDepartment;  // 기업 부서명
}