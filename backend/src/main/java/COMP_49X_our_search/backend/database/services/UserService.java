package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserRole getUserRoleByEmail(String email) {
    return userRepository.findByEmail(email)
        .map(User::getUserRole)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }
}
