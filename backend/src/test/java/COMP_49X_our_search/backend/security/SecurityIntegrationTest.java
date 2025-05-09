/**
 * This class contains integration tests for the security configuration.
 * These tests verify various security-related functionalities, including public and protected endpoint access,
 * OAuth2 login redirection, CORS configuration, and session invalidation upon logout.
 *
 * @SpringBootTest This annotation loads the application context and enable full integration tests so all components
 * and beans are available for testing. Used to make sure that the custom security setup is in place and test the web layer.
 * @ActiveProfiles("test") This annotation specifies the active profile as "test", ensuring that the test-specific configuration
 * is loaded and applied. Used because this test does not need to load in the real database.
 * @AutoConfigureMockMvc This annotation autoconfigures MockMvc, a tool that sets up the necessary components to simulate
 * the web layer (HTTP requests and responses) without the need for a running server.
 * @WithMockUser This annotation simulates the client being authenticated to access a backend resource. Exclusion of this annotation
 * simulates a client that is not authenticated trying to access an endpoint.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGivenNoAuth_whenAccessCheckAuth_thenOk() throws Exception {
        // The endpoint to verify the user's application status is public.
        // Test to ensure CSRF protection is disabled:
        // Verify that the CSRF protection doesn't block a request to a public endpoint.
        mockMvc.perform(get("/check-auth"))
                .andExpect(status().isOk());
    }

    @Test
    void testGivenNoAuth_whenLogin_redirectsToOAuthProvider() throws Exception {
        mockMvc.perform(get("/oauth2/authorization/google"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("https://accounts.google.com/o/oauth2/**"));
    }

    @Test
    void testGivenNoAuth_whenAccessProtectedEndpoint_thenRedirectToLogin() throws Exception {
        //  When an unauthenticated request is made to a protected URL,
        //  Spring Security invokes its authentication entry point—which, by default,
        //  redirects the client (302) to the login page.
        mockMvc.perform(get("/all-projects"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/oauth2/authorization/google"));
    }

    @Test
    @WithMockUser // This annotation makes mocks the user being authenticated
    void testGivenUserAuth_whenAccessProtectedEndpoint_thenOk() throws Exception {
        // When an authenticated request is made to a protected URL,
        // the requested resource is available.
        mockMvc.perform(get("/all-projects"))
                .andExpect(status().isOk());
    }

    @Test
    void testAcceptFrontendOrigin() throws Exception {
        mockMvc.perform(get("/check-auth")
                        .header("Origin", "http://localhost"))
                .andExpect(status().isOk());
    }

    @Test
    void testRejectInvalidOrigins() throws Exception {
        mockMvc.perform(get("/check-auth")
                        .header("Origin", "https://invalid-origin.com"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void testLogoutInvalidatesSession() throws Exception {
        mockMvc.perform(post("/logout"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("https://accounts.google.com/logout"));
    }
}
