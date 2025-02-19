/**
 * This class handles the redirection after a successful login.
 * It extends Spring's `SavedRequestAwareAuthenticationSuccessHandler` and overrides Spring's onAuthenticationSuccess
 * to ensure that after successful authentication, the user is redirected to a URL on the frontend.
 * SecurityConfig registers this class to configure it to the application.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private static final String frontendUrl = "http://localhost:3000"; // TODO hardcoded for now
    private static final String ALLOWED_DOMAIN = "@sandiego.edu";
    private static final String invalidEmailPath = "/invalid-email";

    private final EmailValidator emailValidator;

    public OAuthSuccessHandler(EmailValidator emailValidator) {
        this.emailValidator = emailValidator;
    }

    /**
     * Handles a successful authentication event by storing the user role
     * and redirecting the user to the authenticated page of the frontend app.
     *
     * @param request the HttpServletRequest object that contains the request the client made to the servlet
     * @param response the HttpServletResponse object that contains the response the servlet returns to the client
     * @param authentication the Authentication object that represents the successful authentication
     * @throws ServletException if a servlet-specific error occurs * @throws IOException if an I/O error occurs
     * */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (!emailValidator.isValidEmail(email, ALLOWED_DOMAIN)) {
            rejectAuthentication(request, response);
            return;
        }

        // TODO if they already have a profile, go to /posts
        // else ask for role

        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl(frontendUrl + "/ask-for-role");
        super.onAuthenticationSuccess(request, response, authentication);
    }

    private void rejectAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("login: unauthorized email domain -> sending error");

        // Log the user out & clear all cookies
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, authentication);
        SecurityContextHolder.clearContext(); // clears the Authentication information saved by Spring Security's SecurityContextHolder
        request.getSession().invalidate();
        new CookieClearingLogoutHandler(AbstractRememberMeServices.SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY).logout(request, response, authentication);

        response.sendRedirect(frontendUrl + invalidEmailPath);
    }
}
