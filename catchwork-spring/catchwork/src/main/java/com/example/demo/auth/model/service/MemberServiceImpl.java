package com.example.demo.auth.model.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.auth.model.entity.CorpInfoEntity;
import com.example.demo.auth.model.entity.CorpMemEntity;
import com.example.demo.auth.model.entity.EmailAuthEntity;
import com.example.demo.auth.model.entity.MemberEntity;
import com.example.demo.auth.model.entity.MemberGradeEntity;
import com.example.demo.auth.model.mapper.MemberMapper;
import com.example.demo.auth.model.repository.CorpInfoRepository;
import com.example.demo.auth.model.repository.CorpMemRepository;
import com.example.demo.auth.model.repository.EmailAuthRepository;
import com.example.demo.auth.model.repository.MemberGradeRepository;
import com.example.demo.auth.model.repository.MemberRepository;
import com.example.demo.common.util.Utility;

@Service
@Transactional(rollbackFor = Exception.class)
public class MemberServiceImpl implements MemberService {

	private final MemberMapper mapper;

	private final MemberRepository memberRepository;
	private final CorpMemRepository corpMemRepository;
	private final CorpInfoRepository corpInfoRepository;
	private final MemberGradeRepository memberGradeRepository;
	private final EmailAuthRepository emailAuthRepository;
	
	private final BCryptPasswordEncoder bcrypt;
	private final JavaMailSender emailSender;

	@Value("${file.upload.profile-img-path}")
	private String uploadPath;

//	@Autowired
//	private EntityManager entityManager;
	
	public MemberServiceImpl(
			MemberRepository memberRepository,
			CorpMemRepository corpMemRepository,
			CorpInfoRepository corpInfoRepository,
			MemberGradeRepository memberGradeRepository,
			BCryptPasswordEncoder bCryptPasswordEncoder, 
			MemberMapper mapper,
			JavaMailSender emailSender,
			EmailAuthRepository emailAuthRepository) {
		this.memberRepository = memberRepository;
		this.corpMemRepository = corpMemRepository;
		this.corpInfoRepository = corpInfoRepository;
		this.memberGradeRepository = memberGradeRepository;
		this.bcrypt = bCryptPasswordEncoder;
		this.mapper = mapper;
		this.emailSender = emailSender;
		this.emailAuthRepository = emailAuthRepository;
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
	    	
	        // 기업 정보 조회
	    	CorpInfoEntity corpInfo = corpInfoRepository.findByCorpRegNo(inputMember.getCorpRegNo());
	    	// System.out.println(corpInfo);

	    	if (corpInfo==null) {
	    	    throw new Exception("해당 사업자등록번호로 등록된 기업이 없습니다.");
	    	}
	    	
	    	
	    	// CORP_MEM 생성
	        CorpMemEntity corpMem = new CorpMemEntity();
	        corpMem.setMemNo(memberEntity.getMemNo());
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
	        // System.out.println("[유효성 실패] member == null");
	        return false;
	    }
	    if (member.getMemId() == null || member.getMemId().trim().isEmpty()) {
	        // System.out.println("[유효성 실패] memId is null or empty");
	        return false;
	    }
	    if (member.getMemPw() == null || member.getMemPw().trim().isEmpty()) {
	        // System.out.println("[유효성 실패] memPw is null or empty");
	        return false;
	    }
	    if (member.getMemName() == null || member.getMemName().trim().isEmpty()) {
	        // System.out.println("[유효성 실패] memName is null or empty");
	        return false;
	    }
	    if (member.getMemEmail() == null || member.getMemEmail().trim().isEmpty()) {
	        // System.out.println("[유효성 실패] memEmail is null or empty");
	        return false;
	    }
	    if (member.getMemTel() == null || member.getMemTel().trim().isEmpty()) {
	        // System.out.println("[유효성 실패] memTel is null or empty");
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
	 * 로그인 회원의 정보 조회
	 *
	 */
	@Override
	public Member getLoginMember(String memNo) {
		return mapper.getLoginMember(memNo);
	}

	/** 아이디 찾기
	 * @author JAEHO
	 * @param memName
	 * @param memTel
	 * @param memEmail
	 * @param corpRegNo
	 * @param memType
	 * @return
	 */
	@Override
	public String findId(String memName, String memEmail, String corpRegNo, int memType) {
		
		if(memType == 0) { // 개인 회원
			MemberEntity memberEntity = memberRepository.findByMemNameAndMemEmail(memName, memEmail);
			if(memberEntity == null) {
				return null;
			}
			return memberEntity.getMemId();	
		}
		else if(memType == 1) { // 기업 회원
			// 회원 정보 조회
			MemberEntity memberEntity = memberRepository.findByMemNameAndMemEmail(memName, memEmail);
			if (memberEntity == null) return null;

			// 기업 회원 정보 조회
			CorpMemEntity corpMemEntity = corpMemRepository.findByMemNo(memberEntity.getMemNo());
			if (corpMemEntity == null) return null;

			// 기업 정보 조회
			CorpInfoEntity corpInfoEntity = corpMemEntity.getCorpInfo();
			if (corpInfoEntity == null) return null;

			// 기업 등록번호 비교
			if (!corpInfoEntity.getCorpRegNo().equals(corpRegNo)) return null;

			return memberEntity.getMemId();
		}
		return null;
	}

	/** 비밀번호 찾기
	 * @author JAEHO
	 * @param memId
	 * @param memName
	 * @param memEmail
	 * @param memType
	 * @param corpRegNo
	 * @return
	 */
	@Override
	public Boolean findPw(String memId, String memName, String memEmail, int memType, String corpRegNo) {

		if(memType == 0) { // 개인 회원
			MemberEntity memberEntity = memberRepository.findByMemIdAndMemNameAndMemEmail(memId, memName, memEmail);
			if(memberEntity != null) return true;
		}
		else if(memType == 1) { // 기업 회원
			MemberEntity memberEntity = memberRepository.findByMemIdAndMemNameAndMemEmail(memId, memName, memEmail);
			if(memberEntity == null) return false;

			// 기업 회원 정보 조회
			CorpMemEntity corpMemEntity = corpMemRepository.findByMemNo(memberEntity.getMemNo());
			if(corpMemEntity == null) return false;

			// 기업 정보 조회
			CorpInfoEntity corpInfoEntity = corpMemEntity.getCorpInfo();
			if (corpInfoEntity == null) return false;

			// 기업 등록번호 비교
			if (corpInfoEntity.getCorpRegNo().equals(corpRegNo)) {
				return true;
			}
		}
		return false;
	}
	
	public boolean existEmail(String memEmail) {
		boolean existEmail = memberRepository.existsByMemEmail(memEmail);
		if (existEmail) {
			return true;
		}
		return false;
	}

	/** 이메일 인증번호 발송
	 * @author JAEHO
	 * @param memEmail
	 */
	@Override
	public boolean sendEmail(String memEmail) {
		// 이메일 인증번호 발송
		String authKey = Utility.CreateAuthKey(6);

		Map<String, String> paramMap = new HashMap<>();
		paramMap.put("memEmail", memEmail);
		paramMap.put("authKey", authKey);

		if(!saveEmailAuthKey(paramMap)) {
			throw new RuntimeException("인증번호 저장 실패");
		}

		MimeMessage message = emailSender.createMimeMessage(); // 메일발송에 사용하는 객체

		try {
			// 메일 발송에 사용하는 객체
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			// 메일 발송에 사용하는 객체
			helper.setTo(memEmail);
			helper.setSubject("Catchwork 이메일 인증번호");
			helper.setText(loadHtml(authKey), true);
			helper.addInline("logo", new ClassPathResource("static/images/logo.png"));

			// 메일 발송
			emailSender.send(message);

			return true;
		} catch (Exception e) {
			throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
		}
	}

	/** 이메일 인증번호 확인
	 * @author JAEHO
	 * @param memEmail
	 * @param authKey
	 * @return
	 */
	@Override
	public boolean checkAuthKey(String memEmail, String authKey) {
		// System.out.println("memEmail: " + memEmail);
		// System.out.println("authKey: " + authKey);

		Map<String, String> paramMap = new HashMap<>();
		paramMap.put("memEmail", memEmail);
		paramMap.put("authKey", authKey);

		// System.out.println("paramMap: " + paramMap);

		int result = mapper.checkAuthKey(paramMap);
		if(result > 0) return true;
		return false;
	}

	/** 이메일, 인증번호 저장
	 * @author JAEHO
	 * @param memEmail
	 * @param authKey
	 */
	public boolean saveEmailAuthKey(Map<String, String> paramMap) {
    try {
        EmailAuthEntity emailAuthEntity = new EmailAuthEntity();
        emailAuthEntity.setAuthEmail(paramMap.get("memEmail"));
        emailAuthEntity.setAuthKey(paramMap.get("authKey"));
        emailAuthEntity.setAuthTime(LocalDateTime.now());
        emailAuthRepository.save(emailAuthEntity);
        return true;
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("이메일 인증번호 저장 실패");
    }
}

	/** HTML 생성 메서드
	 * @author JAEHO
	 */
	private String loadHtml(String authKey) {
    return "<!DOCTYPE html>"
         + "<html lang='ko'>"
         + "<head>"
         + "<meta charset='UTF-8'>"
         + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
         + "<title>Catchwork 이메일 인증</title>"
         + "</head>"
         + "<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; background-color: #f5f7fa; color: #333;'>"
         + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);'>"
         
         // 헤더
         + "<div style='background: linear-gradient(135deg, #46B5AB 0%, #46B5AB 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;'>"
         + "<div style='background-color: rgba(255, 255, 255, 0.2); display: inline-block; border-radius: 50%; margin-bottom: 20px; overflow: hidden;'>"
         + "<img src='cid:logo' alt='Catchwork 로고' width='200' height='200' style='display: block; margin: 0 auto; object-fit: contain;'/>"
         + "</div>"
         + "<h1 style='margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);'>Catchwork</h1>"
         + "<p style='margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;'>이메일 인증번호</p>"
         + "</div>"
         
         // 메인 콘텐츠
         + "<div style='padding: 40px 30px;'>"
         + "<div style='text-align: center; margin-bottom: 30px;'>"
         + "<h2 style='margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;'>인증번호를 확인해주세요</h2>"
         + "<p style='margin: 0; color: #666; font-size: 16px; line-height: 1.5;'>아래 인증번호를 입력하여 이메일 인증을 완료해주세요.</p>"
         + "</div>"
         
         // 인증번호 박스
         + "<div style='background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%); border: 2px solid #46B5AB; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; position: relative; overflow: hidden;'>"
         + "<div style='position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, transparent 70%); animation: pulse 2s ease-in-out infinite;'></div>"
         + "<p style='margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;'>인증번호</p>"
         + "<h1 style='margin: 0; color: #46B5AB; font-size: 48px; font-weight: 700; letter-spacing: 8px; text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2); position: relative; z-index: 1;'>" + authKey + "</h1>"
         + "</div>"
         
         // 유효시간 안내
         + "<div style='background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;'>"
         + "<div style='display: flex; align-items: center;'>"
         + "<div style='margin-right: 12px;'>"
         + "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#ff9800' stroke-width='2'>"
         + "<circle cx='12' cy='12' r='10'></circle>"
         + "<polyline points='12,6 12,12 16,14'></polyline>"
         + "</svg>"
         + "</div>"
         + "<p style='margin: 0; color: #e65100; font-size: 14px; font-weight: 500;'>"
         + "<strong>유효시간:</strong> 이 인증번호는 5분간 유효합니다."
         + "</p>"
         + "</div>"
         + "</div>"
         
         // 추가 안내사항
         + "<div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;'>"
         + "<h3 style='margin: 0 0 12px 0; color: #333; font-size: 16px; font-weight: 600;'>📋 안내사항</h3>"
         + "<ul style='margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.6;'>"
         + "<li>인증번호를 정확히 입력해주세요.</li>"
         + "<li>인증번호가 만료된 경우 새로 요청해주세요.</li>"
         + "<li>보안을 위해 인증번호를 타인과 공유하지 마세요.</li>"
         + "</ul>"
         + "</div>"
         + "</div>"
         
         // 푸터
         + "<div style='background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;'>"
         + "<p style='margin: 0 0 8px 0; color: #666; font-size: 14px;'>본 메일은 발신전용입니다.</p>"
         + "<p style='margin: 0; color: #999; font-size: 12px;'>© 2025 Catchwork. All rights reserved.</p>"
         + "</div>"
         
         + "</div>"
         + "</body>"
         + "</html>";
	}

	/** 임시 비밀번호 발송
	 * @author JAEHO
	 * @param memEmail
	 */
	@Override
	public boolean sendTempPw(String memEmail, String memId, String memName) {	
		// 임시 비밀번호 발송
		String tempPw = Utility.createTempPw();

		// 회원 정보 조회
		MemberEntity memberEntity = memberRepository.findByMemIdAndMemNameAndMemEmail(memId, memName, memEmail);
		if(memberEntity == null) {
			throw new RuntimeException("회원 정보 조회 실패");
		}

		String memNo = memberEntity.getMemNo();
		String memPw = bcrypt.encode(tempPw);

		// 임시 비밀번호 저장
		if(!changePw(memNo, memPw)) {
			throw new RuntimeException("인증번호 저장 실패");
		}

		MimeMessage message = emailSender.createMimeMessage(); // 메일발송에 사용하는 객체

		try {
			// 메일 발송에 사용하는 객체
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			// 메일 발송에 사용하는 객체
			helper.setTo(memEmail);
			helper.setSubject("Catchwork 임시 비밀번호");
			helper.setText(loadTempPwHtml(tempPw), true);
			helper.addInline("logo", new ClassPathResource("static/images/logo.png"));

			// 메일 발송
			emailSender.send(message);

			return true;
		} catch (Exception e) {
			throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
		}
	}
	
	/**
	 * JPA를 사용한 비밀번호 변경 메서드
	 * @param memNo 회원 번호
	 * @param memPw 암호화된 비밀번호
	 * @return 업데이트 성공 여부
	 */
	private boolean changePw(String memNo, String memPw) {
		try {
			// 회원 엔티티 조회
			MemberEntity memberEntity = memberRepository.findByMemNo(memNo);
			if (memberEntity == null) {
				return false;
			}
			
			// 비밀번호 업데이트
			memberEntity.setMemPw(memPw);
			
			// JPA save 메서드로 업데이트
			memberRepository.save(memberEntity);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/** 임시 비밀번호 HTML 생성 메서드
	 * @author JAEHO
	 */
	private String loadTempPwHtml(String tempPw) {
    return "<!DOCTYPE html>"
         + "<html lang='ko'>"
         + "<head>"
         + "<meta charset='UTF-8'>"
         + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
         + "<title>Catchwork 임시 비밀번호</title>"
         + "</head>"
         + "<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; background-color: #f5f7fa; color: #333;'>"
         + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);'>"
         
         // 헤더
         + "<div style='background: linear-gradient(135deg, #46B5AB 0%, #46B5AB 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;'>"
         + "<div style='background-color: rgba(255, 255, 255, 0.2); display: inline-block; border-radius: 50%; margin-bottom: 20px; overflow: hidden;'>"
         + "<img src='cid:logo' alt='Catchwork 로고' width='200' height='200' style='display: block; margin: 0 auto; object-fit: contain;'/>"
         + "</div>"
         + "<h1 style='margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);'>Catchwork</h1>"
         + "<p style='margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;'>임시 비밀번호 발급</p>"
         + "</div>"
         
         // 메인 콘텐츠
         + "<div style='padding: 40px 30px;'>"
         + "<div style='text-align: center; margin-bottom: 30px;'>"
         + "<h2 style='margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;'>임시 비밀번호가 발급되었습니다</h2>"
         + "<p style='margin: 0; color: #666; font-size: 16px; line-height: 1.5;'>아래 임시 비밀번호로 로그인 후 새로운 비밀번호로 변경해주세요.</p>"
         + "</div>"
         
         // 임시 비밀번호 박스
         + "<div style='background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%); border: 2px solid #46B5AB; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; position: relative; overflow: hidden;'>"
         + "<div style='position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, transparent 70%); animation: pulse 2s ease-in-out infinite;'></div>"
         + "<p style='margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;'>임시 비밀번호</p>"
         + "<h1 style='margin: 0; color: #46B5AB; font-size: 48px; font-weight: 700; letter-spacing: 8px; text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2); position: relative; z-index: 1;'>" + tempPw + "</h1>"
         + "</div>"
         
         // 보안 안내
         + "<div style='background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;'>"
         + "<div style='display: flex; align-items: center;'>"
         + "<div style='margin-right: 12px;'>"
         + "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#ff9800' stroke-width='2'>"
         + "<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>"
         + "</svg>"
         + "</div>"
         + "<p style='margin: 0; color: #e65100; font-size: 14px; font-weight: 500;'>"
         + "<strong>보안 안내:</strong> 로그인 후 반드시 새로운 비밀번호로 변경해주세요."
         + "</p>"
         + "</div>"
         + "</div>"
         
         // 추가 안내사항
         + "<div style='background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;'>"
         + "<h3 style='margin: 0 0 12px 0; color: #333; font-size: 16px; font-weight: 600;'>📋 안내사항</h3>"
         + "<ul style='margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.6;'>"
         + "<li>임시 비밀번호는 숫자, 영문, 특수문자가 포함되어 있습니다.</li>"
         + "<li>로그인 후 마이페이지에서 비밀번호를 변경해주세요.</li>"
         + "<li>보안을 위해 임시 비밀번호를 타인과 공유하지 마세요.</li>"
         + "</ul>"
         + "</div>"
         + "</div>"
         
         // 푸터
         + "<div style='background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;'>"
         + "<p style='margin: 0 0 8px 0; color: #666; font-size: 14px;'>본 메일은 발신전용입니다.</p>"
         + "<p style='margin: 0; color: #999; font-size: 12px;'>© 2025 Catchwork. All rights reserved.</p>"
         + "</div>"
         
         + "</div>"
         + "</body>"
         + "</html>";
	}

	// 탈퇴 회원 처리(스케줄러)
	@Override
	@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
	public int withdrawMember(int deleteTargetPeriod) {
		return mapper.withdrawMember(deleteTargetPeriod);
	}

	// 이미지 처리(스케줄러)
	@Override
	@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
	public int deleteUnusedImage() {
		// 파일시스템의 이미지 목록 조회
		File dir = new File(uploadPath);
		File[] files = dir.listFiles((d, name) -> name.endsWith(".jpg") || name.endsWith(".png"));

		if (files == null) return 0;

		List<String> fileSystemImageList = Arrays.stream(files)
				.map(File::getName)
				.collect(Collectors.toList());


		// DB에서 사용 중인 이미지 목록 조회
		List<String> usedImageList = mapper.selectUsedImage();

		// 비교하여 사용되지 않는 이미지 식별
		List<String> unusedImageList = new ArrayList<>();
		for (String image : fileSystemImageList) {
				if (!usedImageList.contains(image)) {
						unusedImageList.add(image);
				}
		}

		// 파일 시스템에서 해당 이미지 삭제
		int deleteCount = 0;
		for (String image : unusedImageList) {
				File file = new File(uploadPath, image);
				if (file.exists()) {
						file.delete();
						deleteCount++;
				}
		}

		return deleteCount;
	}

	// 이메일 인증번호 삭제(스케줄러)
	@Override
	@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
	public int removeTargetEmailAuth(int deleteTargetPeriod) {
		return mapper.removeTargetEmailAuth(deleteTargetPeriod);
	}
}
