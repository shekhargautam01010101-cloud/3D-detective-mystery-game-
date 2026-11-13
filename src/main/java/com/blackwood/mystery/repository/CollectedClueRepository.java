package com.blackwood.mystery.repository;
import com.blackwood.mystery.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CollectedClueRepository extends JpaRepository<CollectedClue,Long> { List<CollectedClue> findBySession_IdOrderByClueId(String sessionId); boolean existsBySession_IdAndClueId(String sessionId,Integer clueId); }
