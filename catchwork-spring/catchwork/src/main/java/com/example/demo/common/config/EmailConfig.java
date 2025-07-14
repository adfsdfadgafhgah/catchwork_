package com.example.demo.common.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
@PropertySource("classpath:/config.properties")
public class EmailConfig {

  // 이메일 아이디
  @Value("${spring.mail.username}")
  private String emailUsername;

  // 이메일 비밀번호
  @Value("${spring.mail.password}")
  private String emailPassword;

  // 이메일 설정
  @Bean
  public JavaMailSender javaMailSender() {
    
    // 이메일 설정 프로퍼티
    Properties props = new Properties();
    props.setProperty("mail.transport.protocol", "smtp");
    props.setProperty("mail.smtp.auth", "true");
    props.setProperty("mail.smtp.starttls.enable", "true");
    props.setProperty("mail.debug", "true");
    props.setProperty("mail.smtp.ssl.trust", "smtp.gmail.com");
    props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
    
    // 이메일 설정
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setUsername(emailUsername);
    mailSender.setPassword(emailPassword);
    mailSender.setHost("smtp.gmail.com");
    mailSender.setPort(587);
    mailSender.setDefaultEncoding("UTF-8");
    mailSender.setJavaMailProperties(props);

    return mailSender;
  }
}
