package com.example.demo.common.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;


@ControllerAdvice // 전역적 예외처리 활성화 어노테이션
public class ExceptionController {
   
   @ExceptionHandler(NoResourceFoundException.class)
   public String notFound() {
      return "forward:/error/404.html";
   }
   
   @ExceptionHandler(Exception.class)
   public String allExceptionHandler(Exception e, Model model) {
      
      e.printStackTrace();
      model.addAttribute("e", e);
      
      return "forward:/error/500.html";
   }
   
}