package com.example.demo.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.board.model.dto.Board;
import com.example.demo.board.model.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /**
     * 게시글 목록 조회 (정렬 + 검색)
     * @param sort 정렬 기준 (latest, oldest, likes, comments)
     * @param query 검색어 (없을 경우 공백)
     */
    @GetMapping("boardList")
    public ResponseEntity<?> getBoardList(@RequestParam String sort,
                                          @RequestParam(value="query",required = false, defaultValue = "") String query) {
    	System.out.println();
        try {
            List<Board> boards = boardService.selectBoardList(sort, query.trim());
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            e.printStackTrace(); // 이게 콘솔에 뭐라고 찍히는지 확인해줘!
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 목록 조회 중 오류 발생");
        }
    }
}
	
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

