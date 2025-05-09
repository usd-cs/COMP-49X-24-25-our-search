package COMP_49X_our_search.backend.security;

import COMP_49X_our_search.backend.authentication.OAuthChecker;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class RoleAuthorizationService {

  private UserService userService;
  private OAuthChecker oAuthChecker;

  @Autowired
  public RoleAuthorizationService(UserService userService, OAuthChecker oAuthChecker) {
    this.userService = userService;
    this.oAuthChecker = oAuthChecker;
  }

  public boolean checkUserRoles(Authentication authentication, String... requiredRoles) {
    String userEmail = oAuthChecker.getAuthUserEmail(authentication);
    UserRole userRole = userService.getUserRoleByEmail(userEmail);

    // Always allow admins
    if (userRole == UserRole.ADMIN) {
      return true;
    }
    for (String role : requiredRoles) {
      if (userRole == UserRole.valueOf(role)) {
        return true;
      }
    }
    return false;
  }
}
