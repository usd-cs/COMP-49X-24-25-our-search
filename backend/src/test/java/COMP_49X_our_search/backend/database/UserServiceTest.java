package COMP_49X_our_search.backend.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.UserRepository;
import COMP_49X_our_search.backend.database.services.UserService;

import java.util.Arrays;
import java.util.List;
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

  @Test
  void testCreateUser_newUser_createsSuccessfully() {
    when(userRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());

    User newUser = new User("new@test.com", UserRole.STUDENT);
    when(userRepository.save(any(User.class))).thenReturn(newUser);

    User createdUser = userService.createUser("new@test.com", UserRole.STUDENT);

    assertEquals("new@test.com", createdUser.getEmail());
    assertEquals(UserRole.STUDENT, createdUser.getUserRole());

    verify(userRepository, times(1)).findByEmail("new@test.com");
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  void testCreateUser_existingUser_throwsException() {
    when(userRepository.findByEmail("existing@test.com"))
        .thenReturn(Optional.of(new User("existing@test.com", UserRole.STUDENT)));

    IllegalArgumentException exception = assertThrows(
        IllegalArgumentException.class,
        () -> userService.createUser("existing@test.com", UserRole.STUDENT)
    );

    assertEquals("User with this email already exists.", exception.getMessage());

    verify(userRepository, times(1)).findByEmail("existing@test.com");
    verify(userRepository, times(0)).save(new User("existing@test.com", UserRole.STUDENT)); // Should NOT save
  }

  @Test
  void testDeleteUserByEmail_existingUser_deletesSuccessfully() {
    String email = "user@test.com";
    User user = new User(email, UserRole.STUDENT);

    when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

    userService.deleteUserByEmail(email);

    verify(userRepository, times(1)).findByEmail(email);
    verify(userRepository, times(1)).deleteByEmail(email);

    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    assertFalse(userService.userExists(email));
  }


  @Test
  void testDeleteUserByEmail_nonExistingUser_throwsException() {
    String email = "nonexistent@test.com";

    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    Exception exception = assertThrows(RuntimeException.class, () -> {
      userService.deleteUserByEmail(email);
    });

    assertEquals("Cannot delete user with email 'nonexistent@test.com'. User not found", exception.getMessage());
    verify(userRepository, times(1)).findByEmail(email);
    verify(userRepository, times(0)).deleteByEmail(email);
  }

  @Test
  void testGetAllUsers_returnsAllUsers() {
    List<User> users = Arrays.asList(
            new User("user1@test.com", UserRole.STUDENT),
            new User("user2@test.com", UserRole.FACULTY)
    );

    when(userRepository.findAll()).thenReturn(users);

    List<User> result = userService.getAllUsers();

    assertEquals(2, result.size());
    assertEquals("user1@test.com", result.get(0).getEmail());
    assertEquals("user2@test.com", result.get(1).getEmail());

    verify(userRepository, times(1)).findAll();
  }


}
