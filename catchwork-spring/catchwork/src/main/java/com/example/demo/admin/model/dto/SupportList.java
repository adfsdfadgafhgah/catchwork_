package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportList {
    private int supportNo;                    // 문의 번호
    private String supportCategoryName;       // 카테고리 이름
    private String supportTitle;              // 제목
    private String memNickname;               // 작성자 닉네임
    private String supportDate;               // 작성일자
    private String supportStatus;             // 처리 상태
}
