package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.profile.ProfileModule.DeleteProfileRequest;
import proto.profile.ProfileModule.DeleteProfileResponse;

public class FacultyProfileDeleterTest {

  private FacultyProfileDeleter facultyProfileDeleter;
  private FacultyService facultyService;
  private UserService userService;

  @BeforeEach
  void setUp() {
    facultyService = mock(FacultyService.class);
    userService = mock(UserService.class);
    facultyProfileDeleter = new FacultyProfileDeleter(facultyService, userService);
  }

  @Test
  public void testDeleteProfile_existingFaculty_deletesSuccessfully() {
    String email = "faculty@test.com";
    Faculty faculty = new Faculty();
    faculty.setEmail(email);
    faculty.setId(1);

    when(facultyService.existsByEmail(email)).thenReturn(true);
    when(facultyService.getFacultyByEmail(email)).thenReturn(faculty);

    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail(email).build();
    DeleteProfileResponse response = facultyProfileDeleter.deleteProfile(request);

    assertThat(response.getSuccess()).isTrue();
    assertThat(response.getProfileId()).isEqualTo(1);
    assertThat(response.getErrorMessage()).isEmpty();

    verify(facultyService, times(1)).deleteFacultyByEmail(email);
    verify(userService, times(1)).deleteUserByEmail(email);
  }

  @Test
  public void testDeleteProfile_nonExistingFaculty_returnsExpectedError() {
    String email = "nonexistent@test.com";

    when(facultyService.existsByEmail(email)).thenReturn(false);

    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail(email).build();
    DeleteProfileResponse response = facultyProfileDeleter.deleteProfile(request);

    assertThat(response.getSuccess()).isFalse();
    assertThat(response.getErrorMessage())
        .contains("Faculty with email 'nonexistent@test.com' not found.");

    verify(facultyService, never()).deleteFacultyByEmail(email);
    verify(userService, never()).deleteUserByEmail(email);
  }

  @Test
  public void testDeleteProfile_invalidRequest_throwsException() {
    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail("").build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class, () -> facultyProfileDeleter.deleteProfile(request));

    assertThat(exception.getMessage()).contains("DeleteProfileRequest must contain 'user_email'");

    verify(facultyService, never()).deleteFacultyByEmail(any());
    verify(userService, never()).deleteUserByEmail(any());
  }

  @Test
  public void testDeleteProfile_facultyServiceThrowsException_returnsErrorResponse() {
    String email = "faculty@test.com";
    Faculty faculty = new Faculty();
    faculty.setEmail(email);
    faculty.setId(1);

    when(facultyService.existsByEmail(email)).thenReturn(true);
    when(facultyService.getFacultyByEmail(email)).thenReturn(faculty);
    doThrow(new RuntimeException("Database error"))
        .when(facultyService)
        .deleteFacultyByEmail(email);

    DeleteProfileRequest request = DeleteProfileRequest.newBuilder().setUserEmail(email).build();
    DeleteProfileResponse response = facultyProfileDeleter.deleteProfile(request);

    assertThat(response.getSuccess()).isFalse();
    assertThat(response.getErrorMessage())
        .contains("Error deleting faculty profile: Database error");

    verify(facultyService, times(1)).deleteFacultyByEmail(email);
    verify(userService, never()).deleteUserByEmail(email);
  }
}
