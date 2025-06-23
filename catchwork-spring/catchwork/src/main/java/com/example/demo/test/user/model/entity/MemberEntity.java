package com.example.demo.test.user.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class MemberEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int memNo;
	
	private String memName;
	private String memId;
	private String memPw;

}
