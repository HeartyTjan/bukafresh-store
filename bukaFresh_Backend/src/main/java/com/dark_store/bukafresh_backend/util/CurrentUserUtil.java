package com.dark_store.bukafresh_backend.util;

import com.dark_store.bukafresh_backend.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
public class CurrentUserUtil {
    
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        log.debug("Getting current user ID. Authentication: {}", authentication);
        
        if (authentication == null) {
            log.error("No authentication found in security context");
            throw new RuntimeException("No authentication found");
        }
        
        Object principal = authentication.getPrincipal();
        log.debug("Authentication principal type: {}", principal.getClass().getName());
        
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            log.debug("UserDetails username: {}", userDetails.getUsername());
            
            // Cast to our User model to get the actual user ID
            if (userDetails instanceof User) {
                User user = (User) userDetails;
                log.debug("Found User model with ID: {}", user.getId());
                return user.getId();
            } else {
                // If it's not our User model, try to use the username as ID
                log.warn("UserDetails is not User model, using username as ID: {}", userDetails.getUsername());
                return userDetails.getUsername();
            }
        } else if (principal instanceof String) {
            log.warn("Principal is String: {}", principal);
            if (!"anonymousUser".equals(principal)) {
                return (String) principal;
            }
        }
        
        log.error("No authenticated user found. Principal: {}", principal);
        throw new RuntimeException("No authenticated user found");
    }
    
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               !(authentication.getPrincipal() instanceof String && 
                 "anonymousUser".equals(authentication.getPrincipal()));
    }
}