package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.config.JwtUtil;
import com.dark_store.bukafresh_backend.dto.request.CreateUserRequest;
import com.dark_store.bukafresh_backend.dto.request.LoginRequest;
import com.dark_store.bukafresh_backend.dto.response.LoginResponse;
import com.dark_store.bukafresh_backend.exception.*;
import com.dark_store.bukafresh_backend.model.Role;
import com.dark_store.bukafresh_backend.model.User;
import com.dark_store.bukafresh_backend.repository.UserRepository;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityAlertService securityAlertService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public void createAccount(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(
                    "User with email '" + request.email() + "' already exists."
            );
        }

        String plainToken = UUID.randomUUID().toString();

        User savedUser = userRepository.save(
                User.builder()
                        .email(request.email())
                        .password(passwordEncoder.encode(request.password()))
                        .emailVerificationToken(passwordEncoder.encode(plainToken))
                        .emailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(30))
                        .role(Role.USER)
                        .build()
        );

//        securityAlertService.SendEmailVerificationToNewUser(savedUser, plainToken);
    }

//    @Override
//    public LoginResponse verifyEmail(String userId, String token) {
//
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new TokenNotFoundException("Invalid user"));
//
//        if (Boolean.TRUE.equals(user.getEmailVerified())) {
//
//            throw new UserAlreadyVerifiedException("User Already Verified");
//        }
//
//        if (!passwordEncoder.matches(token, user.getEmailVerificationToken())) {
//            throw new TokenNotFoundException("Invalid token");
//        }
//
//        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
//            throw new TokenExpiredException("Expired token");
//        }
//
//
//        user.setEmailVerified(true);
//        user.setEmailVerificationToken(null);
//        user.setEmailVerificationTokenExpiry(null);
//
//        User savedUser = userRepository.save(user);
//
//        String jwtToken = jwtUtil.generateToken(savedUser);
//
//        return LoginResponse.fromEntity(savedUser, jwtToken);
//    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new UnVerifiedEmailException("Kindly verify your email before logging in");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        String jwtToken = jwtUtil.generateToken(user);

        return LoginResponse.fromEntity(user,jwtToken);

    }
}


