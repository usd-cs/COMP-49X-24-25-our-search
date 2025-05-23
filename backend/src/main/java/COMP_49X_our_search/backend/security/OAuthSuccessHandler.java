/**
 * This class handles the redirection after a successful login.
 * It extends Spring's `SavedRequestAwareAuthenticationSuccessHandler` and overrides Spring's onAuthenticationSuccess
 * to ensure that after successful authentication, the user is redirected to a URL on the frontend.
 * SecurityConfig registers this class to configure it to the application.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import COMP_49X_our_search.backend.database.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final String FRONTEND_URL;
    private final EmailValidator emailValidator;
    private final UserService userService;
    private final LogoutService logoutService;

    @Autowired
    private SecurityConstants securityConstants;

    public OAuthSuccessHandler(@Value("${DOMAIN}") String frontendUrl, EmailValidator emailValidator, UserService userService, LogoutService logoutService, SecurityConstants securityConstants) {
        this.FRONTEND_URL = frontendUrl;
        this.emailValidator = emailValidator;
        this.userService = userService;
        this.logoutService = logoutService;
        this.securityConstants = securityConstants;
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
        System.out.println("user logged in with: " + email);

        if (!emailValidator.isValidEmail(email, securityConstants.getAllowedDomain())) {
            rejectAuthentication(request, response);
            return;
        }

        // check if the user has a profile already or not. This condition determines what frontend url to go to.
        String redirectPath;
        if (userService.userExists(email)) {
            redirectPath = securityConstants.getHasProfilePath();
        } else {
            redirectPath = securityConstants.getNoProfilePath();
        }

        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl(FRONTEND_URL + redirectPath);
        super.onAuthenticationSuccess(request, response, authentication);
    }

    private void rejectAuthentication(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Log the user out & clear all cookies
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (logoutService.logoutCurrentUser(request, response, authentication)) {
            response.sendRedirect(FRONTEND_URL + securityConstants.getInvalidEmailPath());
        }
        else {
            response.sendRedirect(FRONTEND_URL);
        }
    }
}
