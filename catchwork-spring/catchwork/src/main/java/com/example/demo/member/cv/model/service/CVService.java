package com.example.demo.member.cv.model.service;

import java.util.List;

import com.example.demo.member.cv.model.dto.CV;

public interface CVService {

	/** 이력서 주인 확인
	 * @param cvNo
	 * @param memNo
	 * @return
	 */
	boolean isOwner(int cvNo, String memNo);

	/** 이력서 리스트 조회
	 * @param memNo
	 * @return
	 */
	List<CV> selectCVList(String memNo);
	
	/** 이력서 조회
	 * @param cvNo
	 * @return
	 */
	CV selectCV(int cvNo);
	
	/**	이력서 추가
	 * @param cv
	 * @throws Exception
	 */
	void addCV(CV cv) throws Exception;

	
	/** 이력서 수정
	 * @param cv
	 * @throws Exception
	 */
	void updateCV(CV cv) throws Exception;


	/** 이력서 삭제
	 * @param cvNo
	 * @throws Exception
	 */
	void deleteCV(int cvNo) throws Exception;



// 	 void submitCV(String memNo, int cvNo, int recruitNo);
}
