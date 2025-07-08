package com.example.demo.auth.model.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorpMem {
	private String corpMemRoleCheck;
	private String corpMemDept;
}
