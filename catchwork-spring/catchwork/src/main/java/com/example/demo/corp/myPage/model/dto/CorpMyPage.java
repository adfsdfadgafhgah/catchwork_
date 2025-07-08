// package com.example.demo.corp.myPage.model.dto;
package com.example.demo.corp.myPage.model.dto;

import lombok.Data;

@Data
public class CorpMyPage {
    private String corpName;        // 기업명
    private String memId;           // 기업 아이디
    private String memEmail;        // 이메일
    private String memTel;          // 전화번호
    private String memName;         // 담당자 이름
    private String corpDepartment;  // 부서명
    private String memProfilePath;  // 프로필 이미지 경로
    private int    memNo;           // PK
}