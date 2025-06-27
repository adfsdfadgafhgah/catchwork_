package com.example.demo.common.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.servlet.http.HttpServletRequest;


// REST API 예외를 전역적으로 처리하는 컨트롤러 (모든 @RestController 대상)
@RestControllerAdvice
public class ExceptionController {

	// 요청한 리소스를 찾을 수 없을 때 (404) 처리
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Object> notFound(HttpServletRequest request) {
        Map<String, Object> body = Map.of(
            "status", 404,
            "error", "Not Found",
            "path", request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // 처리되지 않은 모든 예외를 전역적으로 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception e, HttpServletRequest request) {
        e.printStackTrace(); // 서버 콘솔에 스택 트레이스 출력 (디버깅용)

        Map<String, Object> body = Map.of(
            "status", 500,
            "error", e.getMessage(),
            "path", request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}