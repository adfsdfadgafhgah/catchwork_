package com.example.demo.cvtest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVPortfolio {
    private String portId;			// 포폴 번호
    private String portName;		// 포폴 이름
    private String portContent;		// 포폴 내용
    private String portStartDate;	// 포폴 시작일
    private String portEndDate;		// 포폴 종료일
    private int cvNo;				// 이력서 번호
}
