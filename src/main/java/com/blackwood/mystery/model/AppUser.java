package com.blackwood.mystery.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="app_users", uniqueConstraints=@UniqueConstraint(columnNames="username"))
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false, unique=true, length=32) private String username;
 @Column(nullable=false) private String passwordHash;
 protected AppUser() {}
 public AppUser(String username,String passwordHash){this.username=username;this.passwordHash=passwordHash;}
 public Long getId(){return id;} public String getUsername(){return username;} public String getPasswordHash(){return passwordHash;}
}
@Entity @Table(name="auth_tokens")
class TokenEntity {
 @Id private String token;
 @ManyToOne(optional=false) private AppUser user;
 @Column(nullable=false) private Instant createdAt=Instant.now();
 protected TokenEntity() {}
 TokenEntity(String token,AppUser user){this.token=token;this.user=user;}
 String getToken(){return token;} AppUser getUser(){return user;}
}
