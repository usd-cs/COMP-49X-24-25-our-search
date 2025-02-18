/**
 * This class contains integration tests for the login success scenario. These tests verify that the user is correctly redirected
 * after a successful OAuth2 login. The OAuth2 login process is mocked to simulate a successful authentication.
 *
 * @SpringBootTest This annotation loads the application context and enable full integration tests so all components
 * and beans are available for testing. Used to make sure that the custom security setup is in place and test the web layer.
 * @ActiveProfiles("test") This annotation specifies the active profile as "test", ensuring that the test-specific configuration
 * is loaded and applied. Used because this test does not need to load in the real database.
 * @AutoConfigureMockMvc This annotation autoconfigures MockMvc, a tool that sets up the necessary components to simulate
 * the web layer (HTTP requests and responses) without the need for a running server.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
public class OAuthSuccessIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testOAuth2LoginSuccessRedirect() throws Exception {
        // This test simulates a successful OAuth2 login and verifies that after authentication,
        // the user is redirected to the expected frontend URL. Since Spring Security handles
        // the actual OAuth2 callback, we use oauth2Login() to mock a successful authentication.
        mockMvc.perform(get("/login/oauth2/code/google")
                        .param("state", "some-state")
                        .param("code", "some-auth-code")
                        .param("scope", "email profile openid")
                        .with(oauth2Login()))
                .andExpect(status().is3xxRedirection());
    }
}
