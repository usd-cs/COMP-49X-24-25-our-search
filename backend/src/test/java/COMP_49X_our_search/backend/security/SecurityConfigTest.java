/**
 * This class contains unit tests for the SecurityConfig class. These tests ensure that the SecurityConfig class
 * sets up the expected security configurations, contributing to the overall security and integrity of the application.
 * *
 * These tests do not go in depth on the SecurityFilterChain bean because Spring Security handles the complex details
 * of building the chain. Instead, these tests focus on verifying that the SecurityConfig provides the correct
 * configuration to HttpSecurity. The outcomes of the security rules are tested with integration tests.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class SecurityConfigTest {

    @Mock
    private OAuthSuccessHandler oAuthSuccessHandler;

    private String mockDomain = "http://localhost";
    private SecurityConstants securityConstants;
    private SecurityConfig securityConfig;

    @BeforeEach
    void setUp() {
        oAuthSuccessHandler = Mockito.mock(OAuthSuccessHandler.class);
        securityConstants = Mockito.mock(SecurityConstants.class);
        Mockito.when(securityConstants.getGoogleLogoutUrl()).thenReturn("https://accounts.google.com/logout");

        securityConfig = new SecurityConfig(mockDomain, oAuthSuccessHandler, securityConstants);
    }

    @Test
    void testSecurityConfig_CorsConfigNotNull() throws Exception {
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();
        assertThat(corsConfigurationSource).isNotNull();
    }

    @Test
    void testCorsConfig_IsUrlBased() throws Exception {
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();

        assertThat(corsConfigurationSource).isInstanceOf(UrlBasedCorsConfigurationSource.class);
    }

    @Test
    void testCorsConfig_OnlyAllowsFrontendRequests() throws Exception {
        CorsConfigurationSource corsConfigurationSource = securityConfig.corsConfigurationSource();

        UrlBasedCorsConfigurationSource urlSource = (UrlBasedCorsConfigurationSource) corsConfigurationSource;
        Map<String, CorsConfiguration> allConfigs = urlSource.getCorsConfigurations();

        assertThat(allConfigs).containsKey("/**");
        Map.Entry<String, CorsConfiguration> registeredConfig = allConfigs.entrySet().iterator().next();
        CorsConfiguration config = registeredConfig.getValue();

        assertThat(config.getAllowedOrigins()).contains(mockDomain);
        assertThat(config.getAllowedMethods()).contains("GET", "POST", "PUT", "DELETE", "OPTIONS");
        assertThat(config.getAllowCredentials()).isTrue();
        assertThat(config.getAllowedHeaders()).contains("*");
    }
}
