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
@Table(name = "EMAIL_AUTH")
@Data
public class EmailAuthEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "email_auth_seq")
  @SequenceGenerator(
    name = "email_auth_seq", 
    sequenceName = "SEQ_AUTH_NO", 
    allocationSize = 1
  )
	@Column(name = "AUTH_NO")
	private Long authNo;

  @Column(name = "AUTH_EMAIL")
  private String authEmail;

  @Column(name = "AUTH_KEY")
  private String authKey;

  @Column(name = "AUTH_TIME")
  private LocalDate authTime;
}
