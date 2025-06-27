package com.example.demo.cv.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVMilitary {
    private String cvMiliClass;     // 군별
    private String cvMiliBranch;    // 군종
    private String cvMiliStartDate;	// 입대일
    private String cvMiliEndDate;	// 전역일
    private int cvNo;				// 이력서 번호
}
