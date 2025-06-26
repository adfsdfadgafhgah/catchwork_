package com.example.demo.company.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavCorp {
	
	//관심기업 테이블
	private String memNo;   // 회원 시퀀스 번호
    private int corpNo;  // 기업 시퀀스 번호
    
    
}
