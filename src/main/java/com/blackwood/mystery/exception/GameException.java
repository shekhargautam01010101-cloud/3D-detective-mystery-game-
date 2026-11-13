package com.blackwood.mystery.exception;
import org.springframework.http.HttpStatus;
public class GameException extends RuntimeException {
 private final HttpStatus status;
 public GameException(HttpStatus status,String message){super(message);this.status=status;}
 public HttpStatus getStatus(){return status;}
 public static GameException bad(String m){return new GameException(HttpStatus.BAD_REQUEST,m);} public static GameException unauthorized(){return new GameException(HttpStatus.UNAUTHORIZED,"A valid X-Auth-Token is required.");} public static GameException missing(String m){return new GameException(HttpStatus.NOT_FOUND,m);}
}
