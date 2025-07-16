package com.example.demo.common.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import com.example.demo.auth.model.service.MemberService;

@Component
@Slf4j
public class MemberScheduling {

  @Autowired
  private MemberService memberService;

  // 삭제 대상 경과일
  private int deleteTargetPeriod = 30;

  // 매일 자정 00:00:00에 실행
  @Scheduled(cron = "0 0 0 * * *")
  public void withdraw() {
    log.info("탈퇴 회원 처리 시작");
    int result = memberService.withdrawMember(deleteTargetPeriod);
    log.info("탈퇴 회원 처리 결과 : " + result);
  }
}
