package com.example.demo.auth.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "MEMBER_GRADE")
@Data
public class MemberGradeEntity {

    @Id
    @Column(name = "MEM_GRADE", nullable = false)
    private Integer memGrade;

    @Column(name = "MEM_GRADE_NAME", nullable = false, length = 10)
    private String memGradeName;

    @Column(name = "MEM_GRADE_PRICE", nullable = false, columnDefinition = "NUMBER(10,2) DEFAULT 0")
    private Double memGradePrice;

    @Column(name = "MEMBERSHIP_BENEFIT", nullable = false, length = 200)
    private String membershipBenefit;
}
