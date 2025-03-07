/**
 * Service class for managing User entities. This class provides business logic for retrieving user
 * data from the database through the UserRepository.
 *
 * <p>This service is annotated with @Service to indicate that it's managed by Spring.
 *
 * @author Augusto Escudero
 * @author Eduardo Perez Rocha
 */
package COMP_49X_our_search.backend.database.services;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

  private final UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserRole getUserRoleByEmail(String email) {
    return userRepository
        .findByEmail(email)
        .map(User::getUserRole)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public boolean userExists(String email) {
    return userRepository.findByEmail(email).isPresent();
  }

  public User createUser(String email, UserRole role) {
    if (userExists(email)) {
      throw new IllegalArgumentException("User with this email already exists.");
    }
    User user = new User(email, role);
    return userRepository.save(user);
  }

  public void deleteUserByEmail(String email) {
    if (!userExists(email)) {
      throw new RuntimeException(
              String.format("Cannot delete user with email '%s'. User not found", email));
    }
    userRepository.deleteByEmail(email);
  }

  public List<User> getAllUsers (){
    return userRepository.findAll();
  }
}
