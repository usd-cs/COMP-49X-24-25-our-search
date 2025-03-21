package COMP_49X_our_search.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface LogoutHandler {
    boolean logoutCurrentUser(HttpServletRequest req, HttpServletResponse res, Authentication authentication);
}
