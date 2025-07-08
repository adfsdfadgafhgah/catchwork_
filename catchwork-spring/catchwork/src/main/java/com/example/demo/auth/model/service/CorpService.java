package com.example.demo.auth.model.service;

import com.example.demo.auth.model.dto.CorpInfo;

public interface CorpService {
    boolean checkCorpRegNo(CorpInfo corp);
    boolean authCorpRegNo(CorpInfo corp);
}