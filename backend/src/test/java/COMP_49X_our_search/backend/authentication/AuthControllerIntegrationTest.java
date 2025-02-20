/**
 * Integration tests for the endpoint that responds with information about the app's current
 * authentication status. Tests that the endpoint returns expected responses based on if the
 * app is authenticated with a user and the user's role.
 * 
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.authentication;

import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OAuthChecker mockOAuthChecker;
    @MockBean
    private UserService mockUserService;

    private String email;

    @BeforeEach
    void setUp() {
        email = "test@sandiego.edu";

        Map<String, String> responseBeforeModification = new HashMap<>();
        responseBeforeModification.put("isAuthenticated", "false");
        responseBeforeModification.put("isStudent", "false");
        responseBeforeModification.put("isFaculty", "false");
        responseBeforeModification.put("isAdmin", "false");

        when(mockOAuthChecker.getDefaultResponse()).thenReturn(responseBeforeModification);
    }

    @Test
    void testCheckAuthStatus_Unauthenticated() throws Exception {
        when(mockOAuthChecker.isAuthenticated(Mockito.any())).thenReturn(false);

        mockMvc.perform(get("/check-auth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAuthenticated").value("false"))
                .andExpect(jsonPath("$.isStudent").value("false"))
                .andExpect(jsonPath("$.isFaculty").value("false"))
                .andExpect(jsonPath("$.isAdmin").value("false"));
    }

    @Test
    void testCheckAuthStatus_AuthenticatedStudent() throws Exception {
        when(mockOAuthChecker.isAuthenticated(Mockito.any())).thenReturn(true);
        when(mockOAuthChecker.getAuthUserEmail(Mockito.any())).thenReturn(email);
        when(mockUserService.userExists(email)).thenReturn(true);
        when(mockUserService.getUserRoleByEmail(email)).thenReturn(UserRole.STUDENT);

        mockMvc.perform(get("/check-auth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAuthenticated").value("true"))
                .andExpect(jsonPath("$.isStudent").value("true"));
    }

    @Test
    void testCheckAuthStatus_AuthenticatedFaculty() throws Exception {
        when(mockOAuthChecker.isAuthenticated(Mockito.any())).thenReturn(true);
        when(mockOAuthChecker.getAuthUserEmail(Mockito.any())).thenReturn(email);
        when(mockUserService.userExists(email)).thenReturn(true);
        when(mockUserService.getUserRoleByEmail(email)).thenReturn(UserRole.FACULTY);

        mockMvc.perform(get("/check-auth"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isAuthenticated").value("true"))
                .andExpect(jsonPath("$.isFaculty").value("true"));
    }

    // TODO the below tests will be executed once the method to check the DB for user role is completed
//    @Test
//    void testCheckAuthStatus_AuthenticatedAdmin() throws Exception {
//    }
}