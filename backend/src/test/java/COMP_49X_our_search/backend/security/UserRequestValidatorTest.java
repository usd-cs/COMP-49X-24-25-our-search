package COMP_49X_our_search.backend.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import COMP_49X_our_search.backend.database.entities.User;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.repositories.UserRepository;
import COMP_49X_our_search.backend.database.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

public class UserRequestValidatorTest {

  private UserRequestValidator userRequestValidator;
  private UserRepository userRepository;
  private UserService userService;
  private User studentUser;
  private User facultyUser;

  @BeforeEach
  void setUp() {
    studentUser = new User();
    studentUser.setEmail("student@test.com");
    studentUser.setUserRole(UserRole.STUDENT);

    facultyUser = new User();
    facultyUser.setEmail("faculty@test.com");
    facultyUser.setUserRole(UserRole.FACULTY);

    userRepository = mock(UserRepository.class);
    userService = new UserService(userRepository);
    userRequestValidator = new UserRequestValidator(userService);
  }

  @Test
  public void testCanMakeRequest_studentRequestsProjects_returnsTrue() {
    when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));

    assertTrue(userRequestValidator.canMakeRequest("student@test.com", "projects"));
    verify(userRepository, times(1)).findByEmail("student@test.com");
  }

  @Test
  public void testCanMakeRequest_studentRequestsStudents_returnsFalse() {
    when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));

    assertFalse(userRequestValidator.canMakeRequest("student@test.com", "students"));
    verify(userRepository, times(1)).findByEmail("student@test.com");
  }

  @Test
  public void testCanMakeRequest_facultyRequestsStudents_returnsTrue() {
    when(userRepository.findByEmail("faculty@test.com")).thenReturn(Optional.of(facultyUser));

    assertTrue(userRequestValidator.canMakeRequest("faculty@test.com", "students"));
    verify(userRepository, times(1)).findByEmail("faculty@test.com");
  }

  @Test
  public void testCanMakeRequest_facultyRequestsProjects_returnsFalse() {
    when(userRepository.findByEmail("faculty@test.com")).thenReturn(Optional.of(facultyUser));

    assertFalse(userRequestValidator.canMakeRequest("faculty@test.com", "projects"));
    verify(userRepository, times(1)).findByEmail("faculty@test.com");
  }

  @Test
  public void testCanMakeRequest_invalidRequestType_returnsFalse() {
    when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(studentUser));

    assertFalse(userRequestValidator.canMakeRequest("student@test.com", "invalidRequest"));
    verify(userRepository, times(1)).findByEmail("student@test.com");
  }

  @Test
  public void testCanMakeRequest_invalidEmail_throwsException() {
    assertThrows(
        RuntimeException.class, () -> userRequestValidator.canMakeRequest(null, "projects"));
  }
}
