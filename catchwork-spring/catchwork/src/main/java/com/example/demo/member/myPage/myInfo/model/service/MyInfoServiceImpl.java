package com.example.demo.member.myPage.myInfo.model.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.common.util.Utility;
import com.example.demo.member.myPage.myInfo.model.mapper.MyInfoMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
@Slf4j
public class MyInfoServiceImpl implements MyInfoService {

  @Autowired
  private MyInfoMapper myInfoMapper;

  // 파일 업로드 경로
  @Value("${file.upload.profile-img-path}")
  private String profileImgPath;

  // 파일 업로드 웹 경로
  @Value("${file.upload.profile-img-web-path}")
  private String profileImgWebPath;

  // 회원 정보 수정
  @Override
  public int updateMemberInfo(Member member) {
    return myInfoMapper.updateMemberInfo(member);
  }

  // 프로필 이미지 수정
  @Override
  public int updateProfileImg(MultipartFile profileImg, String memNo) {

    int result = 0;

    String originalFilename = profileImg.getOriginalFilename();
    String savedName = Utility.fileRename(originalFilename);

    try {
      // 파일 저장 경로
      String uploadPath = profileImgPath + savedName;
      
      // 이미지 파일명 중복 검사
      do{
        savedName = Utility.fileRename(originalFilename);
        uploadPath = profileImgPath + savedName;
      }while(new File(uploadPath).exists());
      
      // 이미지 파일 업로드
      profileImg.transferTo(new File(uploadPath));

      // 프로필 이미지 경로 업데이트
      String webPath = profileImgWebPath + "/" + savedName;

      Map<String, Object> map = new HashMap<>();
      map.put("webPath", webPath);
      map.put("memNo", memNo);

      result = myInfoMapper.updateProfileImg(map);
    
    } catch (IOException e) {
      log.error("프로필 이미지 업로드 실패", e);
      return 0;
    }
    return result;
  }
}
