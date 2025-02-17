package COMP_49X_our_search.backend.security;

import org.springframework.stereotype.Component;

@Component
public class EmailValidator {

    boolean isValidEmail(String email, String ALLOWED_DOMAIN) {
        return ALLOWED_DOMAIN != null && email != null && email.endsWith(ALLOWED_DOMAIN);
    }
}
