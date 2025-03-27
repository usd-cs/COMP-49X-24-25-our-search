/**
 * This controller handles an authentication-related endpoint for the application.
 * The `/check-auth` endpoint checks whether a user is authenticated or not and their user role
 * and returns a JSON response accordingly.
 *
 * @author Natalie Jungquist
 */

package COMP_49X_our_search.backend.authentication;

import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    private final OAuthChecker OAuthChecker;
    private final UserService userService;

    public AuthController(OAuthChecker OAuthChecker, UserService userService) {
        this.OAuthChecker = OAuthChecker;
        this.userService = userService;
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, String>> checkAuthStatus() {

        Map<String, String> response = OAuthChecker.getDefaultResponse();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (OAuthChecker.isAuthenticated(authentication)) {
            response.put("isAuthenticated", "true");

            String email = OAuthChecker.getAuthUserEmail(authentication);
            if (userService.userExists(email)) {
                UserRole role = userService.getUserRoleByEmail(email);
                if (role == UserRole.STUDENT) {
                    response.put("isStudent", "true");
                } else if (role == UserRole.FACULTY) {
                    response.put("isFaculty", "true");
                } else if (role == UserRole.ADMIN) {
                    response.put("isAdmin", "true");
                }
            }
        }

        return ResponseEntity.ok(response);
    }
}
