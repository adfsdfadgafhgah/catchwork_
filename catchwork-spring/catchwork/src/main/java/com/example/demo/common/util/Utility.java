package com.example.demo.common.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class Utility {

  public static String fileRename(String fileName) {

    // 파일이 비어 있는지 확인
    if (fileName == null || fileName.isEmpty()) {
      return null;
    }

    // 파일명 구성
    String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 업로드 날짜 추출
    String ext = fileName.substring(fileName.lastIndexOf(".")); // 확장자 추출
    String uuid = UUID.randomUUID().toString().substring(0, 20); // UUID 20자리 생성

    return today + "_" + uuid + "." + ext;
  }

}
