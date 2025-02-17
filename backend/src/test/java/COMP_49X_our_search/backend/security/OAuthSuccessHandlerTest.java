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

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.io.IOException;

import static org.mockito.Mockito.*;

public class OAuthSuccessHandlerTest {

    private static final String frontendUrl = "http://localhost:3000";
    private static final String invalidEmailPath = "/invalid-email";

    private OAuthSuccessHandler OAuthSuccessHandler;

    @Mock
    private EmailValidator emailValidator;  // Mock EmailValidator

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Authentication authentication;

    @Mock
    private OAuth2User oAuth2User;
    @Mock
    private HttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        OAuthSuccessHandler = new OAuthSuccessHandler(emailValidator);

        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(request.getSession()).thenReturn(session);
    }

    @Test
    void testGivenValidAuth_oauthSuccess_RedirectsToFrontend() throws ServletException, IOException {
        when(oAuth2User.getAttribute("email")).thenReturn("test@sandiego.edu");
        when(emailValidator.isValidEmail("test@sandiego.edu", "@sandiego.edu")).thenReturn(true);

        OAuthSuccessHandler.onAuthenticationSuccess(request, response, authentication);

        verify(response, never()).sendError(anyInt(), anyString()); // No errors for a valid email
    }

    @Test
    void testGivenInvalidAuth_loginFails() throws ServletException, IOException {
        when(oAuth2User.getAttribute("email")).thenReturn("test@invalid-domain.com");
        when(emailValidator.isValidEmail("test@invalid-domain.com", "@sandiego.edu")).thenReturn(false);

        OAuthSuccessHandler.onAuthenticationSuccess(request, response, authentication);

        verify(session).invalidate(); //Session ends to ensure the user does not get logged in
        verify(response).sendRedirect(frontendUrl + invalidEmailPath);
    }
}
