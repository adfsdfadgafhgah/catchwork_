//package com.example.demo.util;
//
//import java.io.IOException;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import com.example.demo.auth.model.dto.CustomUserDetails;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//@Component
//public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request,
//                                        HttpServletResponse response,
//                                        Authentication authentication)
//                                        throws IOException {
//
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        int memType = userDetails.getMemberEntity().getMemType();
//
//        String redirectUrl = switch (memType) {
//            case 0 -> "/";
//            case 1 -> "/corp";
//            default -> "/";  // fallback
//        };
//
//        response.sendRedirect(redirectUrl);
//    }
//
//}
