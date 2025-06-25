package com.example.demo.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("board")
public class BoardController {
	
	/** boardList 정렬 셀렉터
	 * @author BAEBAE
	 * @param sort
	 * @return
	 */
//	@GetMapping("/boardList")
//	public List<Board> getBoardList(@RequestParam String sort) {
//	    switch(sort) {
//	        case "latest": return boardService.getBoardsOrderByCreatedDesc();
//	        case "oldest": return boardService.getBoardsOrderByCreatedAsc();
//	        case "likes": return boardService.getBoardsOrderByLikesDesc();
//	        case "comments": return boardService.getBoardsOrderByCommentsDesc();
//	        default: return boardService.getBoardsOrderByCreatedDesc();
//	    }
//	}
}
