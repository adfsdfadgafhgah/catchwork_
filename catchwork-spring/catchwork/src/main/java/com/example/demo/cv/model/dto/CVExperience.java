package com.example.demo.cv.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVExperience {
    private String expId;			// 경력 번호
    private String expName;         // 회사명
    private String expDept;         // 부서
    private String expContent;      // 업무 내용
    private String expStartDate;	// 시작 날짜
    private String expEndDate;		// 종료 날짜
    private int cvNo;				// 이력서 번호
}
