package com.example.demo.member.myPage.membership.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    private Long subNo;         // 구독 번호
    private int memGrade;       // 멤버십 등급 번호
    private String memNo;       // 회원 번호
    private String subStartAt;  // 구독 시작일
    private String subEndAt;    // 구독 종료일
    private String subUpdateAt; // 구독 변경일
    private String subPayAt;    // 결제일
    private int subStatus;      // 구독 상태 (0: 정상, 1: 변경 대기, 2: 결제 미납)
    
}
