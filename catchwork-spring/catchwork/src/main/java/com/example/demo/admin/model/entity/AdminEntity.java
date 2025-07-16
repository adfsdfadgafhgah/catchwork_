package com.example.demo.admin.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="ADMIN")
@Data
public class AdminEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_seq")
	@SequenceGenerator(
	    name = "admin_seq",
	    sequenceName = "SEQ_ADMIN_NO",
	    allocationSize = 1
	)
	@Column(name = "ADMIN_NO")
    private int adminNO; 

    @Column(name = "ADMIN_ID")
    private String adminId;

    @Column(name = "ADMIN_PW")
    private String adminPw;

    @Column(name = "ADMIN_NICKNAME")
    private String adminNickname;

    @Column(name = "ADMIN_NAME")
    private String adminName;

    @Column(name = "ADMIN_TEL")
    private String adminTel;

    @Column(name = "ADMIN_EMAIL")
    private String adminEmail;

}
