package com.example.demo.cv.model.service;

import com.example.demo.cv.model.dto.CV;

public interface CVService {

	/**	이력서 추가
	 * @param cv
	 * @throws Exception
	 */
	void addCV(CV cv) throws Exception;

}
