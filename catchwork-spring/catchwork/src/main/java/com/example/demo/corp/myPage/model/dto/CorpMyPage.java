package com.example.demo.corp.myPage.model.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class CorpMyPage {
    private String memNo;
    private String memId;
    private String memName;
    private String memEmail;
    private String memTel;
    private String corpMemDept;
    private String corpName;
}
