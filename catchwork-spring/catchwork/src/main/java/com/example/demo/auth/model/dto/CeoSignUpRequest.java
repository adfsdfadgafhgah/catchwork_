package com.example.demo.auth.model.dto;

import lombok.Data;

@Data
public class CeoSignUpRequest {
    private CorpInfo corpInfo;
    private Member ceoMember;
    private CorpMem corpMem;
}