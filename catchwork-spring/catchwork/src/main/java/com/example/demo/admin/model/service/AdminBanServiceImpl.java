package com.example.demo.admin.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.admin.model.dto.AdminBan;
import com.example.demo.admin.model.dto.AdminBanSearch;
import com.example.demo.admin.model.mapper.AdminBanMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminBanServiceImpl implements AdminBanService {

    private final AdminBanMapper mapper;

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
    @Transactional
    @Override
    public int releaseBan(int banNo) {
        AdminBan ban = mapper.selectBanDetail(banNo);

        if (ban == null) return 0;

        String targetNo = ban.getBanTargetNo();
        String type = ban.getBanTargetType();

        // 대상 상태 복원
        switch (type) {
            case "개인회원":
                mapper.updateMemberStatusToNormal(targetNo);
                break;
            case "기업회원":
                mapper.updateMemberNameStatusToNormal(targetNo);
                break;
            case "기업":
                mapper.updateCorpStatusToNormal(targetNo);
                break;
            case "공고":
                mapper.updateRecruitStatusToNormal(targetNo);
                break;
            case "게시글":
                mapper.updateBoardStatusToNormal(targetNo);
                break;
            case "댓글":
                mapper.updateCommentStatusToNormal(targetNo);
                break;
            default:
                break;
        }

        // BAN 테이블 삭제
        return mapper.releaseBan(banNo);
    }
}