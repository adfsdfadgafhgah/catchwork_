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

    /** 복구 대상 고유 번호 */
    private String targetNo;

    /** 복구 대상 타입 (MEMBER, CORP_MEMBER, COMPANY, RECRUIT, BOARD, COMMENT) */
    private String targetType;

    /** 복구 대상 대표 이름/제목/내용 */
    private String target;
}
