package com.example.demo.cvtest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVLanguage {
    private String langId;			// 어학 번호
    private String langName;        // 시험명(토익 등)
    private String langType;        // 언어 종류 (예: 영어, 일본어 등)
    private String langScore;		// 점수
    private String langDate;		// 취득 날짜
    private int cvNo;				// 이력서 번호
}
