package com.example.demo.mypage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CorpMyPage {

    private String companyName;       // 기업명
    private String corpId;         	  // 기업 아이디
    private String corpEmail;         // 이메일
    private String corpPhone;      	  // 전화번호
    private String corpName;      	  // 담당자 이름
    private String departmentName;    // 부서명
}
