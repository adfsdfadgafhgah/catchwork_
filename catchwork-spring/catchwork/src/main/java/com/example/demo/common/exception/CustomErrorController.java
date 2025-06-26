package com.example.demo.common.exception;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Spring Boot에서 기본적으로 제공하는 /error 경로를 오버라이딩하여
 * 커스텀 JSON 형식의 에러 응답을 반환하는 컨트롤러입니다.
 * 
 * 이 컨트롤러는 정적 리소스 오류나 존재하지 않는 경로 요청, 
 * 내부 서버 오류 등이 발생했을 때 JSON으로 오류 정보를 응답합니다.
 */
@RestController
@RequestMapping("/error")
public class CustomErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    /**
     * /error 경로로 들어온 모든 요청을 처리합니다.
     * 요청 중 발생한 상태 코드, 요청 경로, 오류 메시지를 추출해 JSON으로 반환합니다.
     *
     * @param request 서블릿 요청 객체로부터 에러 관련 속성을 추출합니다.
     * @return 상태 코드에 맞는 JSON 응답 (예: {"status":404, "message":"Not Found", "path":"/wrong-url"})
     */
    @RequestMapping
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        // 오류 상태 코드 (예: 404, 500 등) 추출
        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int status = statusObj != null ? Integer.parseInt(statusObj.toString()) : 500;

        // 요청 경로 및 메시지 추출
        String uri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        String message = (String) request.getAttribute(RequestDispatcher.ERROR_MESSAGE);

        // JSON 형태로 오류 응답 반환
        return ResponseEntity.status(status).body(Map.of(
                "status", status,
                "message", message != null ? message : "Unexpected error",
                "path", uri
        ));
    }
}
