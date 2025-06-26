package com.example.demo.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.board.model.dto.Board;

import lombok.RequiredArgsConstructor;

public interface BoardService {

	/** 게시판 목록 조회 서비스
	 * @author BAEBAE
	 * @param sort
	 * @param trim
	 * @return
	 */
	List<Board> selectBoardList(String sort, String query);

}
