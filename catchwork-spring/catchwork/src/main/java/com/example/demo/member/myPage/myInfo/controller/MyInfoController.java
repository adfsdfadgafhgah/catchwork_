package com.example.demo.member.myPage.myInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.myPage.myInfo.model.service.MyInfoService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("mypage")
@Slf4j
public class MyInfoController {

  @Autowired
  private MyInfoService myInfoService;

  // 회원 정보 수정
  @PostMapping("updateMemberInfo")
  public ResponseEntity<String> updateMemberInfo(@RequestBody Member member) {
    try {
     int result = myInfoService.updateMemberInfo(member);
     if(result > 0) return ResponseEntity.status(200).body("회원 정보 수정 완료");
      return ResponseEntity.status(500).body("회원 정보 수정 실패");
    } catch (Exception e) {
      log.error("회원 정보 수정 실패", e);
      return ResponseEntity.status(500).body("회원 정보 수정 실패: " + e.getMessage());
    }
  }

  // 프로필 이미지 수정
  @PostMapping("uploadProfileImg")
  public ResponseEntity<String> updateProfileImg(@RequestParam("imgFile") MultipartFile profileImg, @RequestParam("memNo") String memNo) {
    try {
      int result = myInfoService.updateProfileImg(profileImg, memNo);
      if(result > 0) return ResponseEntity.status(200).body("프로필 이미지 수정 완료");
      return ResponseEntity.status(500).body("프로필 이미지 수정 실패");
    } catch (Exception e) {
      log.error("프로필 이미지 수정 실패", e);
      return ResponseEntity.status(500).body("프로필 이미지 수정 실패: " + e.getMessage());
    }
  }

}
