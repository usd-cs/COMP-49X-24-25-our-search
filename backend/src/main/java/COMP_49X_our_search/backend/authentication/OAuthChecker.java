/**
 * Implementation responsible for handling authentication-related utility functions.
 * Specifically for OAuth2 users.
 *  - Check if a user is authenticated.
 *  - Retrieve the authenticated user's email.
 *  - Provide a default authentication response structure.
 */

package COMP_49X_our_search.backend.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class OAuthChecker implements AuthCheckerInterface {

    @Override
    public Map<String, String> getDefaultResponse() {
        Map<String, String> response = new HashMap<>();
        response.put("isAuthenticated", "false");
        response.put("isStudent", "false");
        response.put("isFaculty", "false");
        response.put("isAdmin", "false");
        return response;
    }

    @Override
    public boolean isAuthenticated(Authentication authentication) {
        return authentication instanceof OAuth2AuthenticationToken;
    }

    @Override
    public String getAuthUserEmail(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User user = oauthToken.getPrincipal();
            Map<String, Object> attributes = user.getAttributes();
            return (attributes != null && attributes.containsKey("email")) ? attributes.get("email").toString() : "";
        }
        return "";
    }
}