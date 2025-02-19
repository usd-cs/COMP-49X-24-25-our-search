package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.UserRepository;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {UserService.class})
@ActiveProfiles("test")
public class UserServiceTest {

  @Autowired
  private UserService userService;

  @MockBean
  private UserRepository userRepository;

  private User user;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setEmail("test@test.com");
    user.setUserRole(UserRole.STUDENT);
  }

  @Test
  void testGetUserRoleByEmail_invalidEmail_throwsException() {
    when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

    UserRole userRole = userService.getUserRoleByEmail("test@test.com");

    assertEquals(UserRole.STUDENT, userRole);
  }

  @Test
  void testGetUserRoleByEmail_validEmail_returnsExpectedResult() {
    when(userRepository.findByEmail("invalid@invalid.com")).thenReturn(Optional.empty());

    RuntimeException exception = assertThrows(RuntimeException.class, () ->
        userService.getUserRoleByEmail("invalid@invalid.com")
    );

    assertEquals("User not found", exception.getMessage());
    verify(userRepository, times(1)).findByEmail("invalid@invalid.com");
  }

  @Test
  void testUserExists_existingUser_returnsExpectedResult() {
    when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

    boolean exists = userService.userExists("test@test.com");

    assertTrue(exists);
    verify(userRepository, times(1)).findByEmail("test@test.com");
  }

  @Test
  void testUserExists_nonexistentUser_returnsExpectedResult() {
    when(userRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());

    boolean exists = userService.userExists("nonexistent@test.com");

    assertFalse(exists);
    verify(userRepository, times(1)).findByEmail("nonexistent@test.com");
  }
}
