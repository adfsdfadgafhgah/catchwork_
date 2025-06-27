package com.example.demo.cv.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVQualify {
    private String qualifyId;			// 자격증 번호
    private String qualifyName;     // 자격증명
    private String qualifyOrg;      // 발급 기관
    private String qualifyDate;		// 취득 날짜
    private int cvNo;				// 이력서 번호
}
