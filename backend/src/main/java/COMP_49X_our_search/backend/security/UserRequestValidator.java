package COMP_49X_our_search.backend.security;

import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Collections;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class UserRequestValidator {

  private final UserService userService;
  private final Map<UserRole, Set<String>> roleToAllowedRequests;

  @Autowired
  public UserRequestValidator(UserService userService) {
    this.userService = userService;
    this.roleToAllowedRequests = initializeRolePermissions();
  }

  public boolean canMakeRequest(String email, String requestType) {
    UserRole userRole = userService.getUserRoleByEmail(email);

    return roleToAllowedRequests.getOrDefault(userRole, Set.of()).contains(requestType.toLowerCase());
  }

  private Map<UserRole, Set<String>> initializeRolePermissions() {
    Map<UserRole, Set<String>> map = new HashMap<>();
    map.put(UserRole.STUDENT, Set.of("projects"));
    map.put(UserRole.FACULTY, Set.of("students"));

    return Collections.unmodifiableMap(map);
  }
}
