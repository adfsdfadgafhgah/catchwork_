package com.example.demo.test.user.model.entity;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "MEMBER")
@Data
public class MemberEntity {

    @Id
    @Column(name = "MEM_NO", length = 36)
    private String memNo = UUID.randomUUID().toString(); 

    @Column(name = "MEM_ID", nullable = false, length = 15, unique = true)
    private String memId;

    @Column(name = "MEM_PW", nullable = false, length = 100)
    private String memPw;

    @Column(name = "MEM_NICKNAME", length = 10)
    private String memNickname;

    @Column(name = "MEM_NAME", nullable = false, length = 20)
    private String memName;

    @Column(name = "MEM_TEL", nullable = false, length = 11, unique = true)
    private String memTel;

    @Column(name = "MEM_EMAIL", nullable = false, length = 20, unique = true)
    private String memEmail;

    @Column(name = "MEM_BIRTHDAY", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date memBirthday;

    @Column(name = "MEM_GENDER", nullable = false, length = 1)
    private String memGender;

    @Column(name = "MEM_ADDR", length = 100)
    private String memAddr;

    @Column(name = "MEM_ENROLLDATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date memEnrollDate = new Date();

    @Column(name = "MEM_SMS_FL", nullable = false, length = 1)
    private String memSmsFl;

    @Column(name = "MEM_TYPE", nullable = false)
    private int memType = 0;

    @Column(name = "MEM_STATUS", nullable = false)
    private int memStatus = 0;

    @Column(name = "MEM_STATUS_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date memStatusDate;

    @Column(name = "MEM_PROFILE_PATH", length = 200)
    private String memProfilePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEM_GRADE", nullable = false)
    private MemberGradeEntity memGrade;

    @Column(name = "MEMBERSHIP_UPDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date membershipUpdate;

}