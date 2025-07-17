package com.example.demo.admin.model.service;

import com.example.demo.admin.model.dto.AdminBan;
import com.example.demo.admin.model.dto.AdminBanSearch;

import java.util.List;
import java.util.Map;

public interface AdminBanService {

    int selectBanCount(Map<String, Object> paramMap);

    Map<String, Object> selectBanList(AdminBanSearch search);

    AdminBan selectBanDetail(int banNo);

    int releaseBan(int banNo);

}
