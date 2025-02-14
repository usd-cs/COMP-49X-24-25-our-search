/**
 * Tests that the OAuthChecker service methods return expected output.
 * 
 * @author Natalie Jungquist 
 */

package COMP_49X_our_search.backend.authentication;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OAuthCheckerTest {

    private OAuthChecker OAuthChecker;

    @BeforeEach
    void setUp() {
        OAuthChecker = new OAuthChecker();
    }

    @Test
    void testGetDefaultResponse() {
        Map<String, String> expectedResponse = new HashMap<>();
        expectedResponse.put("isAuthenticated", "false");
        expectedResponse.put("isStudent", "false");
        expectedResponse.put("isFaculty", "false");
        expectedResponse.put("isAdmin", "false");

        Map<String, String> actualResponse = OAuthChecker.getDefaultResponse();

        assertEquals(expectedResponse, actualResponse, "Default response should match expected structure.");
    }

    @Test
    void testIsAuthenticated_WithOAuth2AuthenticationToken() {
        Authentication mockAuth = mock(OAuth2AuthenticationToken.class);
        assertTrue(OAuthChecker.isAuthenticated(mockAuth), "OAuth2AuthenticationToken should be authenticated.");
    }

    @Test
    void testIsAuthenticated_WithNonOAuthAuthentication() {
        Authentication mockAuth = mock(Authentication.class);
        assertFalse(OAuthChecker.isAuthenticated(mockAuth), "Non-OAuth authentication should not be authenticated.");
    }

    @Test
    void testGetAuthUserEmail_WithValidEmail() {
        OAuth2User mockUser = mock(OAuth2User.class);
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", "test@example.com");

        when(mockUser.getAttributes()).thenReturn(attributes);

        OAuth2AuthenticationToken mockAuth = mock(OAuth2AuthenticationToken.class);
        when(mockAuth.getPrincipal()).thenReturn(mockUser);

        String email = OAuthChecker.getAuthUserEmail(mockAuth);
        assertEquals("test@example.com", email, "Email should be extracted correctly.");
    }

    @Test
    void testGetAuthUserEmail_WithNoEmailAttribute() {
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getAttributes()).thenReturn(new HashMap<>());

        OAuth2AuthenticationToken mockAuth = mock(OAuth2AuthenticationToken.class);
        when(mockAuth.getPrincipal()).thenReturn(mockUser);

        String email = OAuthChecker.getAuthUserEmail(mockAuth);
        assertEquals("", email, "Should return empty string if no email attribute is present.");
    }

    @Test
    void testGetAuthUserEmail_WithNonOAuthAuthentication() {
        Authentication mockAuth = mock(Authentication.class);
        String email = OAuthChecker.getAuthUserEmail(mockAuth);
        assertEquals("", email, "Should return empty string for non-OAuth authentication.");
    }
}

