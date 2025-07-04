package com.example.demo.auth.model.service;

import com.example.demo.auth.model.dto.CorpInfo;

public interface CorpService {
    Object registerCorp(CorpInfo corp);
    boolean checkCorpRegNo(CorpInfo corp);
}