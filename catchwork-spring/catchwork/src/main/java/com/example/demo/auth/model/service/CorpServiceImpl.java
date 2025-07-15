package com.example.demo.auth.model.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.demo.auth.model.dto.CorpInfo;
import com.example.demo.auth.model.entity.CorpInfoEntity;
import com.example.demo.auth.model.repository.CorpInfoRepository;
import com.example.demo.auth.model.repository.MemberRepository;

@Service
@Transactional(rollbackFor = Exception.class)
public class CorpServiceImpl implements CorpService {


    @Value("${corp.service.key}")
    private String serviceKey;
	private final MemberRepository memberRepository;
	private final CorpInfoRepository corpInfoRepository;
    private final WebClient webClient;

	public CorpServiceImpl(CorpInfoRepository corpInfoRepository, WebClient webClient, MemberRepository memberRepository) {
		this.corpInfoRepository = corpInfoRepository;
		this.webClient = webClient;
		this.memberRepository = memberRepository;
	}

	@Override
	// 1. DB 중복 확인
	public boolean checkCorpRegNo(CorpInfo corp) {
		String regNo = corp.getCorpRegNo();
		boolean isValid = false;

		if (corpInfoRepository.existsByCorpRegNo(regNo)) {
			return true; // 이미 등록된 번호
		}
		return isValid;
	}
	public boolean checkCorpCEOName(CorpInfo corp) {
		String ceoName = corp.getCorpCEOName();
		boolean isValid = false;

		if (corpInfoRepository.existsByCorpCEOName(ceoName)) {

			return true; // 이미 등록된 번호
		}
		return isValid;
	}

	
	@Override
	// 2. 사업자 등록번호 유효성 검사
	public boolean authCorpRegNo(CorpInfo corp) {
        // JSON 바디 구성
        Map<String, Object> requestBody = Map.of(
            "businesses", List.of(
                Map.of(
                    "b_no", corp.getCorpRegNo(),
                    "start_dt", corp.getCorpOpenDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                    "p_nm", corp.getCorpCEOName()
                )
            )
        );

        System.out.println(requestBody);
        
        try {
            Map<String, Object> response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/nts-businessman/v1/validate")
                        .queryParam("serviceKey", serviceKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), 
                        clientResponse -> clientResponse.bodyToMono(String.class).map(body -> {
                            System.err.println("API Error Body: " + body); // 에러 본문 출력
                            return new RuntimeException("API 호출 실패: " + body);
                        }))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) response.get("data");
            if (dataList != null && !dataList.isEmpty()) {
                return "01".equals(dataList.get(0).get("valid"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

	@Override
	public String findMemName(String memNo) {
		String memName = memberRepository.findByMemNo(memNo).getMemName();
		return memName;
	}

}
