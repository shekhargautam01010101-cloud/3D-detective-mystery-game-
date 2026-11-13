package com.blackwood.mystery.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(GameException.class) public ResponseEntity<Map<String,Object>> game(GameException ex){return ResponseEntity.status(ex.getStatus()).body(Map.of("timestamp",Instant.now(),"error",ex.getStatus().getReasonPhrase(),"message",ex.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException ex){String message=ex.getBindingResult().getFieldErrors().stream().map(e->e.getField()+": "+e.getDefaultMessage()).findFirst().orElse("Invalid request.");return ResponseEntity.badRequest().body(Map.of("timestamp",Instant.now(),"error","Bad Request","message",message));}
 @ExceptionHandler(Exception.class) public ResponseEntity<Map<String,Object>> other(Exception ex){return ResponseEntity.status(500).body(Map.of("timestamp",Instant.now(),"error","Internal Server Error","message","The request could not be completed."));}
}
