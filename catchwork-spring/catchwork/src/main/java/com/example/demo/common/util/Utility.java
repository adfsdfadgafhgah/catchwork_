package com.example.demo.common.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.Random;

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

    return today + "_" + uuid + ext;
  }

  // 인증번호 생성
  public static String CreateAuthKey(int size) {
    return UUID.randomUUID().toString().replace("-", "").substring(0, size);
  }

  // 임시 비밀번호 생성 (숫자, 영문, 특수문자 포함)
  public static String createTempPw() {
    Random random = new Random();
    
    // 각 카테고리에서 최소 1개씩 선택
    String numbers = "0123456789";
    String letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    String specialChars = "!@#$%^&*";
    
    StringBuilder password = new StringBuilder();
    
    // 각 카테고리에서 1개씩 추가 (총 3개)
    password.append(numbers.charAt(random.nextInt(numbers.length())));
    password.append(letters.charAt(random.nextInt(letters.length())));
    password.append(specialChars.charAt(random.nextInt(specialChars.length())));
    
    // 나머지 5개는 모든 문자에서 랜덤 선택
    String allChars = numbers + letters + specialChars;
    for (int i = 0; i < 5; i++) {
      password.append(allChars.charAt(random.nextInt(allChars.length())));
    }
    
    // 문자들을 섞어서 반환
    char[] passwordArray = password.toString().toCharArray();
    for (int i = passwordArray.length - 1; i > 0; i--) {
      int j = random.nextInt(i + 1);
      char temp = passwordArray[i];
      passwordArray[i] = passwordArray[j];
      passwordArray[j] = temp;
    }
    
    return new String(passwordArray);
  }

}
