package com.example.demo.auth.model.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.CorpInfo;
import com.example.demo.auth.model.dto.CorpMem;
import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.model.entity.CorpInfoEntity;
import com.example.demo.auth.model.entity.CorpMemEntity;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.entity.MemberGradeEntity;
import com.example.demo.auth.model.repository.CorpInfoRepository;
import com.example.demo.auth.model.repository.CorpMemRepository;
import com.example.demo.auth.model.repository.MemberGradeRepository;
import com.example.demo.auth.model.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

//    private final CorpService corpService;
//    private final MemberService memberService;

	private final CorpInfoRepository corpInfoRepository;
	private final MemberRepository memberRepository;
	private final CorpMemRepository corpMemRepository;

	private final MemberGradeRepository memberGradeRepository;
	private final BCryptPasswordEncoder bcrypt;

	@Transactional(rollbackFor = Exception.class)
	public void registerCorpAndCeo(CorpInfo corpInfo, Member ceoMember, CorpMem corpMemDto) {
		CorpInfoEntity corpEntity = registerCorp(corpInfo);
		MemberEntity memberEntity = signup(ceoMember);
		registerCorpMem(memberEntity, corpEntity, corpMemDto);
	}

	// 1. 기업 등록
	public CorpInfoEntity registerCorp(CorpInfo corp) {

		CorpInfoEntity entity = new CorpInfoEntity();
		entity.setCorpName(corp.getCorpName());
		entity.setCorpRegNo(corp.getCorpRegNo());
		entity.setCorpCEOName(corp.getCorpCEOName());
		entity.setCorpAddr(corp.getCorpAddr());
		entity.setCorpBM(corp.getCorpBM());
		entity.setCorpBenefit(corp.getCorpBenefit());
		entity.setCorpBenefitDetail(corp.getCorpBenefitDetail());
		entity.setCorpDetail(corp.getCorpDetail());
		entity.setCorpHomeLink(corp.getCorpHomeLink());
		entity.setCorpLogoPath(corp.getCorpLogo());
		entity.setCorpOpenDate(corp.getCorpOpenDate());
		entity.setCorpType(corp.getCorpType());
		entity.setCorpStatus(0);
		corpInfoRepository.save(entity);
		return entity;

	}

	// 2. 대표자 등록
	public MemberEntity signup(Member inputMember) {
		inputMember.setMemNo(UUID.randomUUID().toString());
		inputMember.setMemGrade(0);

		if (!isValidInput(inputMember)) {
			throw new IllegalArgumentException("입력값이 유효하지 않습니다.");
		}

		if (memberRepository.existsByMemId(inputMember.getMemId())) {
			throw new IllegalStateException("중복된 아이디입니다.");
		}

		if (inputMember.getMemNickname() != null
				&& memberRepository.existsByMemNickname(inputMember.getMemNickname())) {
			throw new IllegalStateException("중복된 닉네임입니다.");
		}

		MemberEntity entity = createMemberEntity(inputMember);
		return memberRepository.save(entity);
	}

	// 3. CORP_MEM 등록
	public CorpMemEntity registerCorpMem(MemberEntity member, CorpInfoEntity corp, CorpMem dto) {
		CorpMemEntity corpMem = new CorpMemEntity();
		corpMem.setMemNo(member.getMemNo());
		corpMem.setCorpInfo(corp);
		corpMem.setCorpMemRoleCheck("Y");
		corpMem.setCorpMemDept("대표이사");

		return corpMemRepository.save(corpMem);
	}

	// 함수 분리해 놓은거
	private boolean isValidInput(Member member) {
		return member != null && member.getMemId() != null && !member.getMemId().trim().isEmpty()
				&& member.getMemPw() != null && !member.getMemPw().trim().isEmpty() && member.getMemName() != null
				&& !member.getMemName().trim().isEmpty() && member.getMemEmail() != null
				&& !member.getMemEmail().trim().isEmpty() && member.getMemTel() != null
				&& !member.getMemTel().trim().isEmpty();
	}

	private MemberEntity createMemberEntity(Member member) {
		MemberEntity entity = new MemberEntity();
		MemberGradeEntity gradeEntity = memberGradeRepository.findById(member.getMemGrade())
				.orElseThrow(() -> new RuntimeException("회원 등급 정보가 없습니다."));

		entity.setMemNo(member.getMemNo());
		entity.setMemId(member.getMemId());
		entity.setMemPw(bcrypt.encode(member.getMemPw()));
		entity.setMemNickname(member.getMemNickname());
		entity.setMemName(member.getMemName());
		entity.setMemTel(member.getMemTel());
		entity.setMemEmail(member.getMemEmail());
		entity.setMemBirthday(member.getMemBirthday());
		entity.setMemGender(member.getMemGender());
		entity.setMemAddr(member.getMemAddr());
		entity.setMemEnrollDate(new Date());
		entity.setMemSmsFl(member.getMemSmsFl());
		entity.setMemType(member.getMemType());
		entity.setMemStatus(0);
		entity.setMemStatusDate(member.getMemStatusDate());
		entity.setMemProfilePath(member.getMemProfilePath());
		entity.setMemGrade(gradeEntity);
		entity.setMembershipUpdate(member.getMembershipUpdate());

		return entity;
	}

	private Member createResponseMember(Member member) {
		Member result = new Member();
		result.setMemName(member.getMemName());
		result.setMemNo(member.getMemNo());
		result.setMemId(member.getMemId());
		result.setMemPw(null); // 보안상 비밀번호는 응답에서 제외
		return result;
	}
}
