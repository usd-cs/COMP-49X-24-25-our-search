/**
 * This controller handles an authentication-related endpoint for the application.
 * The `/check-auth` endpoint checks whether a user is authenticated or not and their user role
 * and returns a JSON response accordingly.
 *
 * @author Natalie Jungquist
 */

// TODO : NOTE THIS IS CURRENTLY A CLASS STUB. ITS TESTS AND FUNCTIONS HAVE NOT BEEN IMPLEMENTED

package COMP_49X_our_search.backend.authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.PublicKey;
import java.util.Map;

@RestController
public class AuthController {

    private final OAuthChecker OAuthChecker;

    public AuthController(OAuthChecker OAuthChecker) {
        this.OAuthChecker = OAuthChecker;
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, String>> checkAuthStatus() {

        Map<String, String> response = OAuthChecker.getDefaultResponse();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (OAuthChecker.isAuthenticated(authentication)) {
            response.put("isAuthenticated", "true");

            String email = OAuthChecker.getAuthUserEmail(authentication);
            System.out.println("email: " + email);

            // TODO check db if they already exist based on the email. returning a default value for now
            response.put("isStudent", "true");
//            response.put("isFaculty", "true");
//            response.put("isAdmin", "true");
        }

        return ResponseEntity.ok(response);
    }
}
