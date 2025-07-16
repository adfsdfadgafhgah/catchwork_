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
@PropertySource("classpath:/config.properties")
// @PropertySource("classpath:/application.properties")
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

  // 이력서 pdf 업로드 경로
  @Value("${file.upload.cv-pdf-path}")
  private String cvPdfPath;

  // ------------------------------

  // 이력서 이미지 관련 경로
  @Value("${cv-img.resource-handler}")
  private String cvImgResourceHandler;

  @Value("${cv-img.resource-location}")
  private String cvImgResourceLocation;

  // ------------------------------

  // 프로필 이미지 관련 경로
  @Value("${profile-img.resource-handler}")
  private String profileImgResourceHandler;

  @Value("${profile-img.resource-location}")
  private String profileImgResourceLocation;

  // ------------------------------

  // 기업 이미지 관련 경로
  @Value("${company-img.resource-handler}")
  private String companyImgResourceHandler;

  @Value("${company-img.resource-location}")
  private String companyImgResourceLocation;

  // ------------------------------

  // 게시글 이미지 관련 경로
  @Value("${board-img.resource-handler}")
  private String boardImgResourceHandler;

  @Value("${board-img.resource-location}")
  private String boardImgResourceLocation;

  // ------------------------------

  // 이미지 관련 경로 설정
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 이력서 이미지 관련 경로
    registry.addResourceHandler(cvImgResourceHandler).addResourceLocations(cvImgResourceLocation);
    // 프로필 이미지 관련 경로
    registry.addResourceHandler(profileImgResourceHandler).addResourceLocations(profileImgResourceLocation);
    // 기업 이미지 관련 경로
    registry.addResourceHandler(companyImgResourceHandler).addResourceLocations(companyImgResourceLocation);
    // 게시글 이미지 관련 경로
    registry.addResourceHandler(boardImgResourceHandler).addResourceLocations(boardImgResourceLocation);
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
