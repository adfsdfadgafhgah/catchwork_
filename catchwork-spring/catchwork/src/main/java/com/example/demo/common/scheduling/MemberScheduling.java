package com.example.demo.common.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

import com.example.demo.auth.model.service.CorpService;
import com.example.demo.auth.model.service.MemberService;

@Component
@Slf4j
public class MemberScheduling {

  @Autowired
  private MemberService memberService;

  @Autowired
  private CorpService corpService;

  // 삭제 대상 경과일
  private int deleteTargetPeriod = 30;

  // 탈퇴 회원 처리(스케줄러)
  // 매일 자정 00:00:00에 실행
  @Scheduled(cron = "0 0 0 * * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void withdraw() {
    log.info("탈퇴 회원 처리 시작");
    int result = memberService.withdrawMember(deleteTargetPeriod);
    log.info("탈퇴 회원 처리 결과 : " + result);
  }

  // 탈퇴 기업 처리(스케줄러)
  // 매일 자정 00:00:00에 실행
  @Scheduled(cron = "0 0 0 * * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void withdrawCompany() {
    log.info("탈퇴 기업 처리 시작");
    int result = corpService.withdrawCompany(deleteTargetPeriod);
    log.info("탈퇴 기업 처리 결과 : " + result);
  }

  // 이메일 인증번호 삭제
  // 매일 자정 00:00:00에 실행
  //@Scheduled(cron = "0 0 0 * * *")
  @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void emailAuth() {
    log.info("이메일 인증번호 처리 시작");
    int result = memberService.removeTargetEmailAuth(deleteTargetPeriod);
    log.info("이메일 인증번호 처리 결과 : " + result);
  }
}
