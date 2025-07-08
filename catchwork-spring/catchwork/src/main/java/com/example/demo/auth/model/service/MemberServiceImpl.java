package com.example.demo.auth.model.service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.model.entity.CorpInfoEntity;
import com.example.demo.auth.model.entity.CorpMemEntity;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.entity.MemberGradeEntity;
import com.example.demo.auth.model.mapper.MemberMapper;
import com.example.demo.auth.model.repository.CorpInfoRepository;
import com.example.demo.auth.model.repository.CorpMemRepository;
import com.example.demo.auth.model.repository.MemberGradeRepository;
import com.example.demo.auth.model.repository.MemberRepository;

import jakarta.persistence.EntityManager;

@Service
@Transactional(rollbackFor = Exception.class)
public class MemberServiceImpl implements MemberService {

	private final MemberMapper mapper;
	private final MemberRepository memberRepository;
	private final CorpInfoRepository corpInfoRepository;
	
	private final MemberGradeRepository memberGradeRepository;
	private final CorpMemRepository corpMemRepository;
	
	private final BCryptPasswordEncoder bcrypt;
	
//	@Autowired
//	private EntityManager entityManager;
	
	public MemberServiceImpl(
			MemberRepository memberRepository,
			CorpMemRepository corpMemRepository,
			CorpInfoRepository corpInfoRepository,
			MemberGradeRepository memberGradeRepository,
			BCryptPasswordEncoder bCryptPasswordEncoder, 
			MemberMapper mapper) {
		this.memberRepository = memberRepository;
		this.corpMemRepository = corpMemRepository;
		this.corpInfoRepository = corpInfoRepository;
		this.memberGradeRepository = memberGradeRepository;
		this.bcrypt = bCryptPasswordEncoder;
		this.mapper = mapper;
	}

	@Transactional(rollbackFor = Exception.class)
	public Object signup(Member inputMember) throws Exception {
	    if (!isValidInput(inputMember)) return "INVALID_INPUT";

	    if (memberRepository.existsByMemId(inputMember.getMemId())) return "DUPLICATE_ID";
	    if (inputMember.getMemNickname() != null && memberRepository.existsByMemNickname(inputMember.getMemNickname()))
	        return "DUPLICATE_NICKNAME";

	    inputMember.setMemNo(UUID.randomUUID().toString());
	    inputMember.setMemGrade(0); // 일반회원은 0 등급 기본

	    // 공통 회원 저장
	    MemberEntity memberEntity = createMemberEntity(inputMember);
	    memberRepository.save(memberEntity);

	    // 기업 회원일 경우 CORP_MEM 등록
	    if (inputMember.getMemType() == 1) {
	    	
	    	System.out.println(inputMember);
	        // 기업 정보 조회
	    	CorpInfoEntity corpInfo = corpInfoRepository.findByCorpRegNo(inputMember.getCorpRegNo());
	    	System.out.println(corpInfo);

	    	if (corpInfo==null) {
	    	    throw new Exception("해당 사업자등록번호로 등록된 기업이 없습니다.");
	    	}
	    	
//	        entityManager.flush();

	    	
	    	// CORP_MEM 생성
	        CorpMemEntity corpMem = new CorpMemEntity();
	        corpMem.setMemNo(memberEntity.getMemNo());
//	        corpMem.setMember(memberEntity);
	    	corpMem.setCorpInfo(corpInfo);
	        corpMem.setCorpMemDept(inputMember.getCorpMemDept());
	        corpMem.setCorpMemRoleCheck("N");
	        corpMemRepository.save(corpMem);
	    }

	    return inputMember;
	}

	@Override
	public boolean isIdAvailable(String memId) {
		return !memberRepository.existsByMemId(memId);
	}

	@Override
	public boolean isNicknameAvailable(String nickname) {
		return !memberRepository.existsByMemNickname(nickname);
	}


	/* 회원가입 헬퍼 메소드 */

	/**
	 * 입력된 회원 정보의 유효성을 검사하는 메서드
	 *
	 * @param member 클라이언트로부터 전달된 회원가입 정보
	 * @return 모든 필수 필드(memId, memPw, memName)가 null이 아니고 공백이 아니면 true, 그렇지 않으면
	 *         false
	 *
	 * @author Won
	 */
	private boolean isValidInput(Member member) {
	    if (member == null) {
	        System.out.println("[유효성 실패] member == null");
	        return false;
	    }
	    if (member.getMemId() == null || member.getMemId().trim().isEmpty()) {
	        System.out.println("[유효성 실패] memId is null or empty");
	        return false;
	    }
	    if (member.getMemPw() == null || member.getMemPw().trim().isEmpty()) {
	        System.out.println("[유효성 실패] memPw is null or empty");
	        return false;
	    }
	    if (member.getMemName() == null || member.getMemName().trim().isEmpty()) {
	        System.out.println("[유효성 실패] memName is null or empty");
	        return false;
	    }
	    if (member.getMemEmail() == null || member.getMemEmail().trim().isEmpty()) {
	        System.out.println("[유효성 실패] memEmail is null or empty");
	        return false;
	    }
	    if (member.getMemTel() == null || member.getMemTel().trim().isEmpty()) {
	        System.out.println("[유효성 실패] memTel is null or empty");
	        return false;
	    }

	    return true;
	}


	/**
	 * Member DTO를 기반으로 DB 저장용 MemberEntity 객체를 생성하는 메서드
	 *
	 * @param member 사용자 입력을 담은 Member 객체
	 * @return 암호화된 비밀번호를 포함한 MemberEntity 객체
	 *
	 * @author Won
	 */
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

	/**
	 * 저장 후 클라이언트에 응답할 Member 객체를 생성하는 메서드
	 *
	 * @param member 원본 사용자 입력 정보
	 * @return 비밀번호 필드를 null 처리한 응답용 Member 객체
	 *
	 * @author Won
	 */
	private Member createResponseMember(Member member) {
		Member result = new Member();
		result.setMemName(member.getMemName());
		result.setMemNo(member.getMemNo());
		result.setMemId(member.getMemId());
		result.setMemPw(null); // 보안상 비밀번호는 응답에서 제외
		return result;
	}


	/**
	 * 로그인 회원의 정보 조회
	 *
	 */
	@Override
	public Member getLoginMember(String memNo) {
		return mapper.getLoginMember(memNo);
	}
	
	/** 기업회원 공고목록 조회용
	 * @author BAEBAE
	 */
	@Override
	public Member getCorpLoginMember(String memNo) {
	    // 기존 멤버 정보
	    Member member = mapper.getLoginMember(memNo);

	    // 추가로 corpNo도 조회
	    Integer corpNo = mapper.getCorpNoByMemNo(memNo);

	    if (member != null && corpNo != null) {
	        member.setCorpNo(corpNo); // 👈 중요!
	    }

	    return member;
	}
}
