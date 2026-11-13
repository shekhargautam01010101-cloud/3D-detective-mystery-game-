package com.blackwood.mystery.repository;
import com.blackwood.mystery.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TokenRepository extends JpaRepository<TokenEntity,String> { Optional<TokenEntity> findByToken(String token); }
