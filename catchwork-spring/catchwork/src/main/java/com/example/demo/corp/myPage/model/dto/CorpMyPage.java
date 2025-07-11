package com.example.demo.corp.myPage.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CorpMyPage {
    // Member 테이블 관련 필드 (회원 정보 수정, 비밀번호 변경 등)
    private String memNo;
    private String memNickname;
    private String memName;
    private String memTel;
    private String memEmail;
    private String memBirthday;
    private String memGender;
    private String memAddr;
    private String memSmsFl; // SMS 수신 여부
    private String memPw;    // 비밀번호 변경 시 사용

    // 여기서는 기업 관련 필드를 직접 가지지 않고
    // CorpCompanyInfoDTO에서 별도로 관리합니다.
}