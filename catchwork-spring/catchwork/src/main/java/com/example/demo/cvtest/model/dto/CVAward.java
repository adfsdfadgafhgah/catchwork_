package com.example.demo.cvtest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVAward {
    private String awardId;			// 수상 번호
    private String awardName;       // 수상명
    private String awardOrg;        // 발급 기관
    private String awardDate;		// 수상 날짜
    private int cvNo;				// 이력서 번호
}
