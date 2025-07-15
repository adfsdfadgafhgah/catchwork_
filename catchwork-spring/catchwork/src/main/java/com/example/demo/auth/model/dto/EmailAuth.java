package com.example.demo.auth.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailAuth {
  private Long authNo;
  private String authEmail;
  private String authKey;
  private LocalDate authTime;
}
