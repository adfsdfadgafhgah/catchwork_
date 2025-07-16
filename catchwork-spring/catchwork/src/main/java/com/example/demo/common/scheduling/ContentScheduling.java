package com.example.demo.common.scheduling;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.corp.recruit.model.service.RecruitService;
import com.example.demo.member.board.model.service.BoardService;
import com.example.demo.member.board.model.service.CommentService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ContentScheduling {

  @Autowired
  private BoardService boardService;

  @Autowired
  private CommentService commentService;

  @Autowired
  private RecruitService recruitService;

  // 삭제 대상 경과일
  private int deleteTargetPeriod = 30;

  // 게시글 삭제
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void board() {
    log.info("게시글 처리 시작");
    int result = boardService.removeTargetBoard(deleteTargetPeriod);
    log.info("게시글 처리 결과 : " + result);
  }

  // 댓글 삭제
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void comment() {
    log.info("댓글 처리 시작");
    int result = commentService.removeTargetComment(deleteTargetPeriod);
    log.info("댓글 처리 결과 : " + result);
  }

  // 공고 삭제
  @Scheduled(cron = "0 0 0 1 * *")
  // @Scheduled(cron = "*/10 * * * * *") // 테스트용
  public void content() {
    log.info("콘텐츠 처리 시작");
    int result = recruitService.removeTargetRecruit(deleteTargetPeriod);
    log.info("콘텐츠 처리 결과 : " + result);
  }
}
