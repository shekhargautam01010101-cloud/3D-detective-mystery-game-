package com.blackwood.mystery.repository;
import com.blackwood.mystery.model.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
public interface GameSessionRepository extends JpaRepository<GameSession,String> {}
