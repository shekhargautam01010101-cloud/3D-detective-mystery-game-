package com.blackwood.mystery.controller;
import com.blackwood.mystery.dto.ApiDtos.*;
import com.blackwood.mystery.model.AppUser;
import com.blackwood.mystery.service.GameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api")
public class GameController {
 private final GameService games; public GameController(GameService games){this.games=games;}
 private AppUser auth(String token){return games.player(token);}
 @PostMapping("/auth/register") public AuthResponse register(@Valid @RequestBody Credentials request){return games.register(request);}
 @PostMapping("/auth/login") public AuthResponse login(@Valid @RequestBody Credentials request){return games.login(request);}
 @GetMapping("/case/intro") public Object intro(){return games.intro();}
 @PostMapping("/game/start") public GameStarted start(@RequestHeader(value="X-Auth-Token",required=false) String token){return games.start(auth(token));}
 @PostMapping("/game/{sessionId}/collect") public Object collect(@PathVariable String sessionId,@Valid @RequestBody ClueRequest request,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.collect(sessionId,request.clueId(),auth(token));}
 @GetMapping("/game/{sessionId}/evidence") public Object evidence(@PathVariable String sessionId,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.evidence(sessionId,auth(token));}
 @PostMapping("/game/{sessionId}/talk") public Object talk(@PathVariable String sessionId,@Valid @RequestBody TalkRequest request,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.talk(sessionId,request.suspectId(),request.questionId(),auth(token));}
 @PostMapping("/game/{sessionId}/confront") public Object confront(@PathVariable String sessionId,@Valid @RequestBody ConfrontRequest request,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.confront(sessionId,request.suspectId(),request.clueId(),auth(token));}
 @PostMapping("/game/{sessionId}/accuse") public Object accuse(@PathVariable String sessionId,@Valid @RequestBody AccuseRequest request,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.accuse(sessionId,request,auth(token));}
 @GetMapping("/game/{sessionId}/hint") public Object hint(@PathVariable String sessionId,@RequestHeader(value="X-Auth-Token",required=false) String token){return games.hint(sessionId,auth(token));}
 @GetMapping("/leaderboard") public Object leaderboard(){return games.top();}
}
