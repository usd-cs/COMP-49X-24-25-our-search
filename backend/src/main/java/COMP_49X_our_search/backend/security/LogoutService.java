package COMP_49X_our_search.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.stereotype.Service;

@Service
public class LogoutService implements LogoutHandler {
    @Override
    public boolean logoutCurrentUser(HttpServletRequest req, HttpServletResponse res, Authentication authentication) {
        try {
            SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
            logoutHandler.logout(req, res, authentication);
            SecurityContextHolder.clearContext(); // clears the Authentication information saved by Spring Security's SecurityContextHolder
            req.getSession().invalidate();
            new CookieClearingLogoutHandler(AbstractRememberMeServices.SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY).logout(req, res, authentication);
            return true;
        } catch (Exception e) {
            System.out.println("log out failed");
            e.printStackTrace();
            return false;
        }
    }
}
