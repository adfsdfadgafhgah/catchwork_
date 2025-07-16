package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Admin {
    private int adminNo;
    private String adminId;
    private String adminPw;
    private String adminNickname;
    private String adminName;
    private String adminTel;
    private String adminEmail;
}
