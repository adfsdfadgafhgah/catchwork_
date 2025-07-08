package com.example.demo.auth.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "CORP_MEM")
@Data
public class CorpMemEntity {

    @Id
    @Column(name = "MEM_NO")
    private String memNo;

    @Column(name = "CORP_MEM_ROLE_CHECK", nullable = false)
    private String corpMemRoleCheck = "N";

    @Column(name = "CORP_MEM_DEPT")
    private String corpMemDept;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CORP_NO", nullable = false)
    private CorpInfoEntity corpInfo;
}