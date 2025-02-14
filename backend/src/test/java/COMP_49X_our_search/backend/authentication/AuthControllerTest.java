/**
 * Tests that the controller for our endpoint to respond with current authentication status returns 
 * expected responses to the frontend.
 * 
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.authentication;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthController authController;

    @Mock
    private OAuthChecker mockOAuthChecker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(mockOAuthChecker);
    }

    @Test
    void testCheckAuthStatus_Unauthenticated() {
        Map<String, String> defaultResponse = Map.of(
                "isAuthenticated", "false",
                "isStudent", "false",
                "isFaculty", "false",
                "isAdmin", "false"
        );

        when(mockOAuthChecker.getDefaultResponse()).thenReturn(defaultResponse);
        when(mockOAuthChecker.isAuthenticated(any())).thenReturn(false);

        ResponseEntity<Map<String, String>> response = authController.checkAuthStatus();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(defaultResponse, response.getBody());
    }

    @Test
    void testCheckAuthStatus_Authenticated() {
        Map<String, String> expectedResponse = Map.of(
                "isAuthenticated", "true",
                "isStudent", "true",
                "isFaculty", "false",
                "isAdmin", "false"
        );

        Authentication mockAuth = mock(Authentication.class);
        when(mockOAuthChecker.getDefaultResponse()).thenReturn(expectedResponse);
        when(mockOAuthChecker.isAuthenticated(mockAuth)).thenReturn(true);
        when(mockOAuthChecker.getAuthUserEmail(mockAuth)).thenReturn("test@student.example.com");

        ResponseEntity<Map<String, String>> response = authController.checkAuthStatus();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedResponse.get("isAuthenticated"), response.getBody().get("isAuthenticated"));
        assertEquals(expectedResponse.get("isStudent"), response.getBody().get("isStudent"));
    }
}