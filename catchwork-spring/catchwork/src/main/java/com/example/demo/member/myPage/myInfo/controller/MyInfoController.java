package com.example.demo.member.myPage.myInfo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.auth.model.dto.Member;
import com.example.demo.member.board.model.dto.Board;
import com.example.demo.corp.recruit.model.dto.Recruit;
import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.myPage.myInfo.model.service.MyInfoService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("myPage")
@Slf4j
public class MyInfoController {

	@Autowired
	private MyInfoService myInfoService;

	// 회원 정보 수정
	@PostMapping("updateMemberInfo")
	public ResponseEntity<String> updateMemberInfo(@RequestBody Member member) {
		try {
			int result = myInfoService.updateMemberInfo(member);
			if (result > 0) {
				log.info("회원 정보 수정 완료");
				return ResponseEntity.status(200).body("회원 정보 수정 완료");
			}
			log.warn("회원 정보 수정 실패");
			return ResponseEntity.status(500).body("회원 정보 수정 실패");
		} catch (Exception e) {
			log.error("회원 정보 수정 실패", e);
			return ResponseEntity.status(500).body("회원 정보 수정 실패: " + e.getMessage());
		}
	}

	// 프로필 이미지 수정
	@PostMapping("uploadProfileImg")
	public ResponseEntity<String> updateProfileImg(@RequestParam("imgFile") MultipartFile profileImg,
			@RequestParam("memNo") String memNo) {
		log.debug("프로필 이미지 업로드 요청 - memNo: {}, fileName: {}", memNo, profileImg.getOriginalFilename());
		try {
			int result = myInfoService.updateProfileImg(profileImg, memNo);
			if (result > 0)
				return ResponseEntity.status(200).body("프로필 이미지 수정 완료");
			return ResponseEntity.status(500).body("프로필 이미지 수정 실패");
		} catch (Exception e) {
			log.error("프로필 이미지 수정 실패", e);
			return ResponseEntity.status(500).body("프로필 이미지 수정 실패: " + e.getMessage());
		}
	}

	// 프로필 이미지 삭제
	@PostMapping("deleteProfileImg")
	public ResponseEntity<String> deleteProfileImg(@RequestParam("memNo") String memNo) {
		log.debug("프로필 이미지 삭제 요청 - memNo: {}", memNo);
		int result = myInfoService.deleteProfileImg(memNo);
		if (result > 0)
			return ResponseEntity.status(200).body("프로필 이미지 삭제 완료");
		return ResponseEntity.status(500).body("프로필 이미지 삭제 실패");
	}

	// 비밀번호 확인
	@PostMapping("verifyPassword")
	public ResponseEntity<Boolean> verifyPassword(@RequestBody Member loginMember) {
		log.debug("비밀번호 확인 요청 - memNo: {}", loginMember.getMemNo());
		try {
			int result = myInfoService.verifyPassword(loginMember);
			if (result > 0) {
				log.debug("비밀번호 확인 성공");
				return ResponseEntity.status(200).body(true);
			}
			log.warn("비밀번호 불일치");
			return ResponseEntity.status(500).body(false);
		} catch (Exception e) {
			log.error("비밀번호 확인 실패", e);
			return ResponseEntity.status(500).body(false);
		}
	}

	// 비밀번호 변경
	@PostMapping("changePw")
	public ResponseEntity<String> changePw(@RequestParam("currentPw") String currentPw,
			@RequestParam("memPw") String memPw, @RequestParam("memNo") String memNo) {
		log.debug("비밀번호 변경 요청 - memNo: {}", memNo);

		Member loginMember = new Member();
		loginMember.setMemNo(memNo);
		loginMember.setMemPw(currentPw);

		try {
			// 현재 비밀번호 확인
			int result = myInfoService.verifyPassword(loginMember);
			if (result > 0) {
				// 비밀번호 변경
				result = myInfoService.changePw(memPw, memNo);
				if (result > 0) {
					log.info("비밀번호 변경 완료");
					return ResponseEntity.status(200).body("비밀번호 변경 완료");
				}
				log.warn("비밀번호 변경 실패");
				return ResponseEntity.status(500).body("비밀번호 변경 실패");
			}
			log.warn("비밀번호 확인 실패");	
			return ResponseEntity.status(500).body("비밀번호 확인 실패");
		} catch (Exception e) {
			log.error("비밀번호 변경 실패", e);
			return ResponseEntity.status(500).body("비밀번호 변경 실패: " + e.getMessage());
		}
	}

	// 회원 탈퇴
	@PutMapping("withdraw")
	public ResponseEntity<String> withdraw(@RequestBody Member loginMember) {
		// System.out.println("탈퇴 메서드 매핑");
		try {
			int result = myInfoService.verifyPassword(loginMember);
			// System.out.println("result: " + result);
			if (result > 0) {
				result = myInfoService.withdraw(loginMember);
				if (result > 0) {
					// System.out.println("탈퇴 완료");
					return ResponseEntity.status(200).body("탈퇴가 완료되었습니다.");
				}
				// System.out.println("탈퇴 실패");
				return ResponseEntity.status(500).body("탈퇴 실패");
			}
			return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
		} catch (Exception e) {
			log.error("탈퇴 실패", e);
			return ResponseEntity.status(500).body("탈퇴 실패: " + e.getMessage());
		}
	}

	// 좋아요한 공고 목록
	@GetMapping("favRecruitList")
	public ResponseEntity<List<Recruit>> getFavRecruitList(
			@RequestParam(value = "recruitJobName", required = false, defaultValue = "all") String recruitJobName,
			@RequestParam(value = "recruitJobArea", required = false, defaultValue = "all") String recruitJobArea,
			@RequestParam(value = "recruitCareer", required = false, defaultValue = "all") String recruitCareer,
			@RequestParam(value = "recruitEdu", required = false, defaultValue = "all") String recruitEdu,
			@RequestParam(value = "corpType", required = false, defaultValue = "all") String corpType,
			@RequestParam(value = "recruitType", required = false, defaultValue = "all") String recruitType,
			@RequestParam(value = "query", required = false, defaultValue = "") String query,
			@RequestParam(value = "memNo", required = false) String memNo,
			@RequestParam(name = "page", required = false) Integer page,
            @RequestParam(name = "size", required = false) Integer size
	) {
		Integer offset = null;
		if(page!=null) {
			offset = (page - 1) * size;
		}
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("recruitJobName", recruitJobName);
		paramMap.put("recruitJobArea", recruitJobArea);
		paramMap.put("recruitCareer", recruitCareer);
		paramMap.put("recruitEdu", recruitEdu);
		paramMap.put("corpType", corpType);
		paramMap.put("recruitType", recruitType);
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("offset", offset);
		paramMap.put("size", size);

		List<Recruit> recruitList = myInfoService.getFavRecruitList(paramMap);
		return ResponseEntity.ok(recruitList);
	}

	// 좋아요한 기업 목록
	@GetMapping("favCorpList")
	public ResponseEntity<List<CompanyInfo>> getFavCorpList(
			@RequestParam(value = "query", required = false, defaultValue = "") String query,
			@RequestParam(value = "memNo", required = false) String memNo,

			// 무한 스크롤
			@RequestParam(name = "page", required = false) Integer page,
			@RequestParam(name = "size", required = false) Integer size
	) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("page", page);
		paramMap.put("size", size);

		List<CompanyInfo> corpList = myInfoService.getFavCorpList(paramMap);
		return ResponseEntity.ok(corpList);
	}

	// 즐겨찾기 게시글 목록
	@GetMapping("favBoardList")
	public ResponseEntity<List<Board>> getFavBoardList(
			@RequestParam(value = "query", required = false, defaultValue = "") String query,
			@RequestParam(value = "memNo", required = false) String memNo,
			@RequestParam(name = "sort") String sort,

			// 무한 스크롤
			@RequestParam(name = "page", required = false) Integer page,
			@RequestParam(name = "size", required = false) Integer size
	) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("sort", sort);
		paramMap.put("page", page);
		paramMap.put("size", size);

		List<Board> boardList = myInfoService.getFavBoardList(paramMap);
		return ResponseEntity.ok(boardList);
	}

	// 내가 쓴 게시글 목록
	@GetMapping("myBoardList")
	public ResponseEntity<List<Board>> getMyBoardList(
			@RequestParam(value = "query", required = false, defaultValue = "") String query,
			@RequestParam(value = "memNo", required = false) String memNo,
			@RequestParam(name = "sort") String sort,

			// 무한 스크롤
			@RequestParam(name = "page", required = false) Integer page,
			@RequestParam(name = "size", required = false) Integer size
	) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("sort", sort);
		paramMap.put("page", page);
		paramMap.put("size", size);

		List<Board> boardList = myInfoService.getMyBoardList(paramMap);
		return ResponseEntity.ok(boardList);
	}

	// 내가 쓴 댓글 목록
	@GetMapping("myCommentList")
	public ResponseEntity<List<Map<String, Object>>> getMyCommentList(
			@RequestParam(value = "query", required = false, defaultValue = "") String query,
			@RequestParam(value = "memNo", required = false) String memNo,

			// 무한 스크롤
			@RequestParam(name = "page", required = false) Integer page,
			@RequestParam(name = "size", required = false) Integer size
	) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("page", page);
		paramMap.put("size", size);

		List<Map<String, Object>> commentList = myInfoService.getMyCommentList(paramMap);
		System.out.println("commentList : " + commentList);
		return ResponseEntity.ok(commentList);
	}

	// 내가 지원한 채용공고 목록
	@GetMapping("myRecruitList")
	public ResponseEntity<List<Recruit>> getMyRecruitList(
		@RequestParam(value = "recruitJobName", required = false, defaultValue = "all") String recruitJobName,
		@RequestParam(value = "recruitJobArea", required = false, defaultValue = "all") String recruitJobArea,
		@RequestParam(value = "recruitCareer", required = false, defaultValue = "all") String recruitCareer,
		@RequestParam(value = "recruitEdu", required = false, defaultValue = "all") String recruitEdu,
		@RequestParam(value = "corpType", required = false, defaultValue = "all") String corpType,
		@RequestParam(value = "recruitType", required = false, defaultValue = "all") String recruitType,
		@RequestParam(value = "query", required = false, defaultValue = "") String query,
		@RequestParam(value = "memNo", required = false) String memNo,
		@RequestParam(name = "page", required = false) Integer page,
        @RequestParam(name = "size", required = false) Integer size
	) {	
		Integer offset = null;
		if(page!=null) {
			offset = (page - 1) * size;
		}
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("recruitJobName", recruitJobName);
		paramMap.put("recruitJobArea", recruitJobArea);
		paramMap.put("recruitCareer", recruitCareer);
		paramMap.put("recruitEdu", recruitEdu);
		paramMap.put("corpType", corpType);
		paramMap.put("recruitType", recruitType);
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		paramMap.put("offset", offset);
		paramMap.put("size", size);

		List<Recruit> recruitList = myInfoService.getMyRecruitList(paramMap);
		return ResponseEntity.ok(recruitList);
	}
}
