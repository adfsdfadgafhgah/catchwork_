package com.example.demo.member.cv.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVTraining {
    private String trainId;				// 교육 번호
    private String trainName;			// 교육 이름
    private String trainOrganization;	// 교육 기관
    private String trainContent;		// 교육 내용	
    private String trainStartDate;		// 교육 시작일
    private String trainEndDate;		// 교육 종료일
    private int cvNo;					// 이력서 번호
}
