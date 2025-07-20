package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRestore {

    private String targetType;      // 테이블 구분용 (MEMBER, COMPANY, RECRUIT, BOARD, COMMENT)
    private String targetNo;        // 고유 번호
    private String title;			// 글인 경우 제목 또는 내용
    private String content;         // 닉네임, 이름
}
