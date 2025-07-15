package com.example.demo.common.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.auth.model.service.CorpService;
import com.example.demo.auth.model.service.MemberService;
import com.example.demo.member.board.model.service.BoardService;
import com.example.demo.member.cv.model.service.CVService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ImageScheduling {

  @Autowired
  private BoardService boardService;

  @Autowired
  private MemberService memberService;

  @Autowired
  private CVService cvService;

  @Autowired
  private CorpService corpService;

  // 게시글 이미지 처리
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void image() {
    log.info("이미지 처리 시작");
    int result = boardService.deleteUnusedImage();
    log.info("이미지 처리 결과 : " + result);
  }

  // 회원 이미지 처리
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void memberImage() {
    log.info("회원 이미지 처리 시작");
    int result = memberService.deleteUnusedImage();
    log.info("회원 이미지 처리 결과 : " + result);
  }

  // 이력서 이미지 처리
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void cvImage() {
    log.info("이력서 이미지 처리 시작");
    int result = cvService.deleteUnusedImage();
    log.info("이력서 이미지 처리 결과 : " + result);
  }

  // 기업 이미지 처리
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void corpImage() {
    log.info("기업 이미지 처리 시작");
    int result = corpService.deleteUnusedImage();
    log.info("기업 이미지 처리 결과 : " + result);
  }
}
