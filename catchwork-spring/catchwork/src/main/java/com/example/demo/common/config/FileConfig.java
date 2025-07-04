package com.example.demo.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.MultipartConfigElement;

@Configuration
// @PropertySource("classpath:/config.properties") // 추후에 이미지 관련 속성을 config.properties로 이동후 주석 해제
@PropertySource("classpath:/application.properties")
public class FileConfig implements WebMvcConfigurer {
  
  // 이미지 임계값
  @Value("${spring.servlet.multipart.file-size-threshold}")
  private long fileSizeThreshold;

  // 임계값 초과 시 파일 저장 경로
  @Value("${spring.servlet.multipart.location}")
  private String location;

  // 이미지 파일 크기 설정
  @Value("${spring.servlet.multipart.max-file-size}")
  private long maxFileSize;

  // 이미지 요청 크기 설정
  @Value("${spring.servlet.multipart.max-request-size}")
  private long maxRequestSize;

  // ------------------------------

  // 이력서 이미지 관련 경로
  @Value("${file.upload.cv-img-path}")
  private String cvImgPath;

  @Value("${file.upload.cv-img-web-path}")
  private String cvImgWebPath;

  // ------------------------------

  // 프로필 이미지 관련 경로
  @Value("${file.upload.profile-img-path}")
  private String profileImgPath;

  @Value("${file.upload.profile-img-web-path}")
  private String profileImgWebPath;

  // ------------------------------

  // 기업 이미지 관련 경로
  @Value("${file.upload.company-img-path}")
  private String companyImgPath;

  @Value("${file.upload.company-img-web-path}")
  private String companyImgWebPath;

  // ------------------------------

  // 게시글 이미지 관련 경로
  @Value("${file.upload.board-img-path}")
  private String boardImgPath;

  @Value("${file.upload.board-img-web-path}")
  private String boardImgWebPath;

  // ------------------------------

  // 이미지 관련 경로 설정
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 이력서 이미지 관련 경로
    registry.addResourceHandler(cvImgWebPath).addResourceLocations(cvImgPath);
    // 프로필 이미지 관련 경로
    registry.addResourceHandler(profileImgWebPath).addResourceLocations(profileImgPath);
    // 기업 이미지 관련 경로
    registry.addResourceHandler(companyImgWebPath).addResourceLocations(companyImgPath);
    // 게시글 이미지 관련 경로
    registry.addResourceHandler(boardImgWebPath).addResourceLocations(boardImgPath);
  }

  // 이미지 업로드 관련 설정
  @Bean
  public MultipartConfigElement multipartConfigElement() {
    MultipartConfigFactory factory = new MultipartConfigFactory();
    factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));
    factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
    factory.setFileSizeThreshold(DataSize.ofBytes(fileSizeThreshold));
    factory.setLocation(location);
    return factory.createMultipartConfig();
  }

  // resolver 설정
  @Bean
  public MultipartResolver multipartResolver() {
    StandardServletMultipartResolver resolver = new StandardServletMultipartResolver();
    return resolver;
  }

}
