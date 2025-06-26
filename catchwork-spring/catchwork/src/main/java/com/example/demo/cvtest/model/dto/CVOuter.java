package com.example.demo.cvtest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVOuter {
    private String outerId;				// 활동 번호
    private String outerName;           // 활동명
    private String outerOrganization;   // 소속기관
    private String outerContent;		// 활동내용
    private String outerStartDate;		// 활동 시작일
    private String outerEndDate;		// 활동 종료일
    private int cvNo;					// 이력서 번호
}
