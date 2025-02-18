/**
 * Defines functions for extracting the details of authenticated user.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.authentication;

import org.springframework.security.core.Authentication;

import java.util.Map;

public interface AuthCheckerInterface {
    Map<String, String> getDefaultResponse();
    boolean isAuthenticated(Authentication authentication);
    String getAuthUserEmail(Authentication authentication);
}
