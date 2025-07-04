package com.example.demo.auth.model.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.entity.MemberGradeEntity;
import com.example.demo.auth.model.mapper.MemberMapper;
import com.example.demo.auth.model.repository.MemberGradeRepository;
import com.example.demo.auth.model.repository.MemberRepository;

@Service
//@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemberServiceImpl implements MemberService {

//	@Autowired
	private final MemberRepository memberRepository;
	private final MemberGradeRepository memberGradeRepository;
//	private final MemberGradeRepository memberGradeRepository;

//	@Autowired
	private final BCryptPasswordEncoder bcrypt;

//	@Autowired
	private final MemberMapper mapper;

	public MemberServiceImpl(
			MemberRepository memberRepository, 
			MemberGradeRepository memberGradeRepository,
			BCryptPasswordEncoder bCryptPasswordEncoder, 
			MemberMapper mapper) {
		this.memberRepository = memberRepository;
		this.memberGradeRepository = memberGradeRepository;
		this.bcrypt = bCryptPasswordEncoder;
		this.mapper = mapper;
	}

	@Override
	public Object signup(Member inputMember) {
		System.out.println("signup service");
//		memNo UUID 생성
		inputMember.setMemNo(UUID.randomUUID().toString());
//		memGrade 0 기본 설정
		inputMember.setMemGrade(0);

//	    입력값 검증
		if (!isValidInput(inputMember)) {
			return "INVALID_INPUT";
		}

//	    중복 MEM_ID 체크
		if (memberRepository.existsByMemId(inputMember.getMemId())) {
			return "DUPLICATE_ID";
		}
//	    중복 MEM_NICKNAME 체크
		if (memberRepository.existsByMemNickname(inputMember.getMemNickname())) {
			return "DUPLICATE_NICKNAME";
		}

		try {
			// 회원 정보 저장
			MemberEntity entity = createMemberEntity(inputMember);
			MemberEntity saved = memberRepository.save(entity);
			System.out.println("saved entity = " + saved);

			// 응답용 Member 객체 생성 (비밀번호 제외)
			return createResponseMember(inputMember);

		} catch (Exception e) {
			// 저장 중 오류 발생 시 예외 던지기
			System.out.println(e);
			throw new RuntimeException("회원 정보 저장 중 오류 발생", e);
		}
	}

	@Override
	public boolean isIdAvailable(String memId) {
		return !memberRepository.existsByMemId(memId);
	}

	@Override
	public boolean isNicknameAvailable(String nickname) {
		return !memberRepository.existsByMemNickname(nickname);
	}

	/**
	 * 사용자 로그인을 처리하는 메서드
	 *
	 * @param inputMember 로그인 요청 정보 (memId, memPw 포함)
	 * @return 로그인 성공 시 "SUCCESS", 실패 시 에러 코드 문자열
	 *
	 * @author Won
	 */
//	@Override
//	public String signin(Member inputMember) {
//	    // 입력값 검증
//	    if (!isValidSigninInput(inputMember)) {
//	        return "INVALID_INPUT";
//	    }
//	    
//	    try {
//	        // DB에서 사용자 조회
//	        MemberEntity memberEntity = memberRepository.findByMemId(inputMember.getMemId());
//	        
//	        // 사용자가 존재하지 않는 경우
//	        if (memberEntity == null) {
//	            return "USER_NOT_FOUND";
//	        }
//	        
//	        // 비밀번호 검증
//	        if (!bcrypt.matches(inputMember.getMemPw(), memberEntity.getMemPw())) {
//	            return "INVALID_PASSWORD";
//	        }
//	        
//	        // 로그인 성공
//	        String token = generateJWTToken(memberEntity);
//	        return token;
//	        
//	    } catch (Exception e) {
//	        throw new RuntimeException("로그인 처리 중 오류가 발생했습니다.", e);
//	    }
//	}
//	
//	// JWT 토큰 생성 메서드 (실제 JWT 라이브러리 사용 필요)
//	private String generateJWTToken(MemberEntity member) {
//	    // 실제로는 JWT 라이브러리를 사용해서 토큰 생성
//	    // 예시: return jwtUtil.generateToken(member.getMemId());
//	    return "jwt.token.example." + member.getMemId(); // 임시 토큰
//	}

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
		return member != null && member.getMemId() != null && !member.getMemId().trim().isEmpty()
				&& member.getMemPw() != null && !member.getMemPw().trim().isEmpty() && member.getMemName() != null
				&& !member.getMemName().trim().isEmpty() && member.getMemEmail() != null
				&& !member.getMemEmail().trim().isEmpty() && member.getMemTel() != null
				&& !member.getMemTel().trim().isEmpty() && member.getMemNickname() != null
				&& !member.getMemNickname().trim().isEmpty();
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

	/* 로그인 헬퍼 메소드 */
	/**
	 * 로그인 입력값의 유효성을 검사하는 메서드
	 *
	 * @param member 로그인 요청 정보
	 * @return memId와 memPw가 null이 아니고 공백이 아니면 true, 그렇지 않으면 false
	 *
	 * @author Won
	 */
	private boolean isValidSigninInput(Member member) {
		return member != null && member.getMemId() != null && !member.getMemId().trim().isEmpty()
				&& member.getMemPw() != null && !member.getMemPw().trim().isEmpty();
	}

	/**
	 * 로그인 회원의 정보 조회
	 *
	 */
	@Override
	public Member getLoginMember(String memNo) {
		return mapper.getLoginMember(memNo);
	}
}
