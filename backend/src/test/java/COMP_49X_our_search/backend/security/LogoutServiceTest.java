package COMP_49X_our_search.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.mockito.Mock;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

class LogoutServiceTest {

    private LogoutService logoutService;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private Authentication authentication;
    @Mock
    private HttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        logoutService = new LogoutService();

        when(request.getSession()).thenReturn(session);
    }

    @Test
    void logoutCurrentUser_Success() {
        boolean result = logoutService.logoutCurrentUser(request, response, authentication);

        assertTrue(result, "Logout should be successful");

        verify(request, times(1)).getSession();
        verify(session, times(1)).invalidate();
    }

    @Test
    void logoutCurrentUser_Exception() {
        doThrow(new RuntimeException("Session error")).when(session).invalidate();

        boolean result = logoutService.logoutCurrentUser(request, response, authentication);

        assertFalse(result, "Logout should fail due to exception");
    }
}