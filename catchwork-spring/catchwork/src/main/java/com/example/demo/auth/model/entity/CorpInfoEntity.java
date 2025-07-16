package com.example.demo.auth.model.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "CORP_INFO")
@Data
public class CorpInfoEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "corp_seq")
	@SequenceGenerator(
	    name = "corp_seq",
	    sequenceName = "SEQ_CORP_NO",
	    allocationSize = 1
	)
	@Column(name = "CORP_NO")
	private Long corpNo;
	
    @Column(name = "CORP_REG_NO")
    private String corpRegNo;

    @Column(name = "CORP_CEO_NAME")
    private String corpCEOName;

    @Column(name = "CORP_OPEN_DATE")
    private LocalDate corpOpenDate;

    @Column(name = "CORP_NAME")
    private String corpName;

    @Column(name = "CORP_TYPE")
    private String corpType;

    @Column(name = "CORP_ADDR")
    private String corpAddr;

    @Column(name = "CORP_HOME_LINK")
    private String corpHomeLink;

    @Column(name = "CORP_BM")
    private String corpBM;

    @Column(name = "CORP_DETAIL")
    private String corpDetail;

    @Column(name = "CORP_BENEFIT")
    private String corpBenefit;

    @Column(name = "CORP_BENEFIT_DETAIL")
    private String corpBenefitDetail;

    @Column(name = "CORP_LOGO")
    private String corpLogoPath;

    @Column(name = "CORP_STATUS")
    private Integer corpStatus;

    @Column(name = "CORP_STATUS_DATE")
    private LocalDate corpStatusDate;
}
