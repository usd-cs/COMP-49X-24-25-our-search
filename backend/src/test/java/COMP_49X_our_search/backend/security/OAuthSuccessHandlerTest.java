/**
 * The LoginSuccessHandler class overrides Spring Security's onAuthenticationSuccess() method.
 * These tests ensure that the class correctly handles authentication success scenarios.
 * If the login should succeed, the only verification we can do at the unit level is
 * ensuring that no exceptions are thrown.
 * If the login should not succeed, we test that login does not complete and an error occurs.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import COMP_49X_our_search.backend.database.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class OAuthSuccessHandlerTest {

    private OAuthSuccessHandler OAuthSuccessHandler;
    private SecurityConstants securityConstants;

    @Mock private EmailValidator emailValidator;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private Authentication authentication;
    @Mock private OAuth2User oAuth2User;
    @Mock private UserService userService;
    @Mock private HttpSession session;
    @Mock private LogoutService logoutService;
    @MockBean private SecurityContextHolderAwareRequestWrapper requestWrapper;

    @BeforeEach
    void setUp() {
        String mockDomain = "http://localhost";
        securityConstants = mock(SecurityConstants.class);
        when(securityConstants.getFrontendUrl()).thenReturn(mockDomain);

        MockitoAnnotations.openMocks(this);
        OAuthSuccessHandler = new OAuthSuccessHandler(mockDomain, emailValidator, userService, logoutService, securityConstants);

        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(request.getSession()).thenReturn(session);
    }

    @Test
    void testGivenValidAuth_hasProfile_RedirectsToFrontend() throws ServletException, IOException {
        String email = "test@sandiego.edu";
        when(oAuth2User.getAttribute("email")).thenReturn(email);
        when(emailValidator.isValidEmail(email, "@sandiego.edu")).thenReturn(true);
        when(userService.userExists(email)).thenReturn(true);

        OAuthSuccessHandler.onAuthenticationSuccess(request, response, authentication);

        verify(response, never()).sendError(anyInt(), anyString()); // No errors for a valid email and a profile
    }

    @Test
    void testGivenValidAuth_noProfile_RedirectsToFrontend() throws ServletException, IOException {
        String email = "test@sandiego.edu";
        when(oAuth2User.getAttribute("email")).thenReturn(email);
        when(emailValidator.isValidEmail(email, "@sandiego.edu")).thenReturn(true);
        when(userService.userExists(email)).thenReturn(false);

        OAuthSuccessHandler.onAuthenticationSuccess(request, response, authentication);

        verify(response, never()).sendError(anyInt(), anyString()); // No errors for a valid email and no profile
    }

    @Test
    void testGivenInvalidAuth_loginFails() throws ServletException, IOException {
        String invalidEmail = "test@invalid-domain.com";
        when(oAuth2User.getAttribute("email")).thenReturn(invalidEmail);
        when(emailValidator.isValidEmail(invalidEmail, "@sandiego.edu")).thenReturn(false);
        SecurityContext context = mock(SecurityContext.class);
        SecurityContextHolder.setContext(context);
        when(context.getAuthentication()).thenReturn(authentication);
        when(request.getSession()).thenReturn(session);
        when(logoutService.logoutCurrentUser(
                any(HttpServletRequest.class),
                any(HttpServletResponse.class),
                eq(authentication)
        )).thenReturn(true);

        OAuthSuccessHandler.onAuthenticationSuccess(request, response, authentication);

        verify(logoutService, times(1)).logoutCurrentUser(
                any(HttpServletRequest.class),
                any(HttpServletResponse.class),
                eq(authentication)
        );
        verify(response).sendRedirect(securityConstants.getFrontendUrl() + securityConstants.getInvalidEmailPath());
    }
}
