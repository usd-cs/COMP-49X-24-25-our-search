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

public class SecurityConstants {

    static final String FRONTEND_URL = "http://localhost"; // DEV
    // static final String FRONTEND_URL = "http://oursearch.dedyn.io"; // PROD
    static final String ALLOWED_DOMAIN = "@sandiego.edu";
    static final String INVALID_EMAIL_PATH = "/invalid-email";
    static final String NO_PROFILE_PATH = "/ask-for-role";
    static final String HAS_PROFILE_PATH = "/posts";
    static final String GOOGLE_LOGOUT_URL = "https://accounts.google.com/logout";
    static final String OAUTH_REDIRECT_ENDPOINT = "/login/oauth2/code/google"; // this is created by spring security/google
}
