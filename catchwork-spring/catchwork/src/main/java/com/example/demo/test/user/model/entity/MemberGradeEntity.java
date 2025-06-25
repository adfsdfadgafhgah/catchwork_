package com.example.demo.test.user.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "MEMBER_GRADE")
@Data
public class MemberGradeEntity {

    @Id
    @Column(name = "MEM_GRADE_NO")
    private Integer memGradeNo;

    @Column(name = "MEM_GRADE_NAME", nullable = false, length = 10)
    private String memGradeName;

    @Column(name = "MEM_GRADE_PRICE", nullable = false)
    private Double memGradePrice;
}
