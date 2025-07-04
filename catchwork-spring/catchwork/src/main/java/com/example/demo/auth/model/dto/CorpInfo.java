package com.example.demo.auth.model.dto;

import java.time.LocalDate;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorpInfo {
    private String corpRegNo;
    private String corpCEOName;
    private LocalDate corpOpenDate;
    private String corpName;
    private String corpType;
    private String corpAddr;
    private String detailAddress;
    private String corpHomeLink;
    private String corpBM;
    private String corpDetail;
    private String corpBenefit;
    private String corpBenefitDetail;
    private String corpLogo; // ※ 파일이라면 MultipartFile로 분리 필요
}
