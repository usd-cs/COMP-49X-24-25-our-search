/**
 * This class validates emails based on specific requirements for the application's authentication.
 * The isValidEmail method specifically targets validating a given email based on its domain.
 * This is so the app can only allow users with certain domains to authenticate.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.security;

import org.springframework.stereotype.Component;

@Component
public class EmailValidator {

    boolean isValidEmail(String email, String ALLOWED_DOMAIN) {
        return ALLOWED_DOMAIN != null && email != null && email.endsWith(ALLOWED_DOMAIN);
    }
}
