package com.example.demo.admin.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.AdminBan;
import com.example.demo.admin.model.dto.AdminBanSearch;
import com.example.demo.admin.model.mapper.AdminBanMapper;


@Service
public class AdminBanServiceImpl implements AdminBanService {

	@Autowired
    private AdminBanMapper mapper;

    @Override
    public int selectBanCount(Map<String, Object> paramMap) {
        return mapper.selectBanCount(paramMap);
    }

    @Override
    public Map<String, Object> selectBanList(AdminBanSearch search) {
        int count = mapper.selectBanCount(searchToMap(search));
        List<AdminBan> list = mapper.selectBanList(searchToMap(search));

        Map<String, Object> result = new HashMap<>();
        result.put("banList", list);
        result.put("totalCount", count);
        return result;
    }
    
    private Map<String, Object> searchToMap(AdminBanSearch search) {
        Map<String, Object> map = new HashMap<>();
        map.put("banTargetType", search.getBanTargetType());
        map.put("keyword", search.getKeyword());
        map.put("offset", search.getOffset());
        map.put("amount", search.getAmount());
        return map;
    }
    
    @Override
    public AdminBan selectBanDetail(int banNo) {
        return mapper.selectBanDetail(banNo);
    }

    // 정지 해제 로직 (BAN 테이블 삭제 + 대상 테이블 STATUS 복원)
    @Override
    @Transactional
    public int releaseBan(int banNo, String targetNo, String targetType) {

        int result = mapper.releaseBan(banNo);

        if (result > 0) {
            switch (targetType) {
                case "MEMBER":
                    mapper.updateMemberStatusToNormal(targetNo);
                    break;
                case "CORP_MEMBER":
                    mapper.updateMemberNameStatusToNormal(targetNo);
                    break;
                case "COMPANY":
                    mapper.updateCorpStatusToNormal(targetNo);
                    break;
                case "RECRUIT":
                    mapper.updateRecruitStatusToNormal(targetNo);
                    break;
                case "BOARD":
                    mapper.updateBoardStatusToNormal(targetNo);
                    break;
                case "COMMENT":
                    mapper.updateCommentStatusToNormal(targetNo);
                    break;
            }
        }

        return result;
    }
}