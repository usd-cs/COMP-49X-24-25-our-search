package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;

public class StudentProfileDeleterTest {

  private StudentProfileDeleter studentProfileDeleter;
  private StudentService studentService;
  private UserService userService;

  @BeforeEach
  void setUp() {
    studentService = mock(StudentService.class);
    userService = mock(UserService.class);
    studentProfileDeleter = new StudentProfileDeleter(studentService, userService);
  }

  @Test
  public void testDeleteProfile_existingStudent_deletesSuccessfully() {
    String email = "student@test.com";
    Student student = new Student();
    student.setEmail(email);
    student.setId(1);

    when(studentService.existsByEmail(email)).thenReturn(true);
    when(studentService.getStudentByEmail(email)).thenReturn(student);

    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail(email).build();

    DeleteProfileResponse response = studentProfileDeleter.deleteProfile(request);

    assertThat(response.getSuccess()).isTrue();
    assertThat(response.getProfileId()).isEqualTo(1);
    assertThat(response.getErrorMessage()).isEmpty();

    verify(studentService, times(1)).deleteStudentByEmail(email);
    verify(userService, times(1)).deleteUserByEmail(email);
  }

  @Test
  public void testDeleteProfile_nonExistingStudent_returnsExpectedError() {
    String email = "nonexistent@test.com";

    when(studentService.existsByEmail(email)).thenReturn(false);

    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail(email).build();

    DeleteProfileResponse response = studentProfileDeleter.deleteProfile(request);

    assertThat(response.getSuccess()).isFalse();
    assertThat(response.getErrorMessage()).contains("Student with email 'nonexistent@test.com' not found.");

    verify(studentService, never()).deleteStudentByEmail(email);
    verify(userService, never()).deleteUserByEmail(email);
  }

  @Test
  public void testDeleteProfile_invalidRequest_throwsException() {
    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail("").build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> studentProfileDeleter.deleteProfile(request));

    assertThat(exception.getMessage()).contains("DeleteProfileRequest must contain 'user_email'");

    verify(studentService, never()).deleteStudentByEmail(any());
    verify(userService, never()).deleteUserByEmail(any());
  }
}
