/**
 * This class defines constants that are shared between the classes in the security package,
 * as well as their respective test cases.
 * //
 * All routes and URLs used in the security configuration and authentication flows
 * are centralized here to ensure consistency and accessibility across both the
 * application source code and test cases.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SecurityConstants {
    @Value("${DOMAIN}")
    static String domain;

    public String getFrontendUrl() {
      return domain;
    }

    public String getAllowedDomain() {
        return "@sandiego.edu";
    }

    public String getInvalidEmailPath() {
        return "/invalid-email";
    }

    public String getNoProfilePath() {
        return "/ask-for-role";
    }

    public String getHasProfilePath() {
        return "/posts";
    }

    public String getGoogleLogoutUrl() {
        return "https://accounts.google.com/logout";
    }

    public String getOauthRedirectEndpoint() {
        return "/login/oauth2/code/google";
    }
}
