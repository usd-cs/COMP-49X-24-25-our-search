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
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.Objects;

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

        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(defaultResponse, response.getBody());
    }

    @SuppressWarnings("null") // added because if response.getBody().get(...) returns null, the test should fail
    @Test
    void testCheckAuthStatus_AuthenticatedStudent() {
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

        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals(expectedResponse.get("isAuthenticated"), Objects.requireNonNull(response.getBody()).get("isAuthenticated"));
        assertEquals(expectedResponse.get("isStudent"), response.getBody().get("isStudent"));
    }

    @SuppressWarnings("null") // added because if response.getBody().get(...) returns null, the test should fail
    @Test
    void testCheckAuthStatus_AuthenticatedFaculty() {
        Map<String, String> expectedResponse = Map.of(
                "isAuthenticated", "true",
                "isStudent", "false",
                "isFaculty", "true",
                "isAdmin", "false"
        );

        // TODO once method to get user role from DB is implemented
//        Authentication mockAuth = mock(Authentication.class);
//        when(mockOAuthChecker.getDefaultResponse()).thenReturn(expectedResponse);
//        when(mockOAuthChecker.isAuthenticated(mockAuth)).thenReturn(true);
//        when(mockOAuthChecker.getAuthUserEmail(mockAuth)).thenReturn("test@faculty.example.com");
//
//        ResponseEntity<Map<String, String>> response = authController.checkAuthStatus();
//
//        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
//        assertEquals(expectedResponse.get("isAuthenticated"), Objects.requireNonNull(response.getBody()).get("isAuthenticated"));
//        assertEquals(expectedResponse.get("isFaculty"), response.getBody().get("isFaculty"));
    }

    @SuppressWarnings("null") // added because if response.getBody().get(...) returns null, the test should fail
    @Test
    void testCheckAuthStatus_AuthenticatedAdmin() {
        Map<String, String> expectedResponse = Map.of(
                "isAuthenticated", "true",
                "isStudent", "false",
                "isFaculty", "false",
                "isAdmin", "true"
        );

        // TODO once method to get user role from DB is implemented
//        Authentication mockAuth = mock(Authentication.class);
//        when(mockOAuthChecker.getDefaultResponse()).thenReturn(expectedResponse);
//        when(mockOAuthChecker.isAuthenticated(mockAuth)).thenReturn(true);
//        when(mockOAuthChecker.getAuthUserEmail(mockAuth)).thenReturn("test@admin.example.com");
//
//        ResponseEntity<Map<String, String>> response = authController.checkAuthStatus();
//
//        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
//        assertEquals(expectedResponse.get("isAuthenticated"), Objects.requireNonNull(response.getBody()).get("isAuthenticated"));
//        assertEquals(expectedResponse.get("isAdmin"), response.getBody().get("isAdmin"));
    }
}