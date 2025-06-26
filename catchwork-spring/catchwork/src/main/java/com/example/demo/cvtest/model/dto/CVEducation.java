package com.example.demo.cvtest.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVEducation {
    private String eduName;				// 학교 이름
    private String eduMajor;			// 전공
    private String eduStartDate;		// 입학일
    private String eduEndDate;			// 졸업일
    private String eduCodeNo;           // 학위 코드
    private String eduStatusCodeNo;     // 학력 상태 코드 (졸업, 재학 등)
    private int cvNo;					// 이력서 번호
}
