package com.blackwood.mystery.dto;
import jakarta.validation.constraints.*;
import java.util.List;
public final class ApiDtos {
 private ApiDtos() {}
 public record Credentials(@NotBlank @Size(min=3,max=32) @Pattern(regexp="[A-Za-z0-9_]+") String username,@NotBlank @Size(min=8,max=72) String password) {}
 public record AuthResponse(String token,String username) {}
 public record ClueRequest(@Min(1) int clueId) {}
 public record TalkRequest(@NotBlank String suspectId,@NotBlank String questionId) {}
 public record ConfrontRequest(@NotBlank String suspectId,@Min(1) int clueId) {}
 public record AccuseRequest(@NotBlank String suspectId,@NotNull @Size(min=2,max=2) List<Integer> proofClueIds) {}
 public record GameStarted(String sessionId,int attemptsLeft,int hintsUsed) {}
}
