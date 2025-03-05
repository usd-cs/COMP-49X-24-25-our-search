package COMP_49X_our_search.backend.profile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.FacultyProto;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;

public class FacultyProfileEditorTest {

  private FacultyService facultyService;
  private DepartmentService departmentService;
  private UserService userService;
  private FacultyProfileEditor facultyProfileEditor;

  @BeforeEach
  void setUp() {
    facultyService = mock(FacultyService.class);
    departmentService = mock(DepartmentService.class);
    userService = mock(UserService.class);
    facultyProfileEditor = new FacultyProfileEditor(facultyService, departmentService, userService);
  }

  @Test
  void testEditProfile_validFacultyProfile_returnsSuccessResponse() {
    FacultyProto updatedFacultyProto =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Computer Science")
            .build();

    Faculty existingFaculty = new Faculty();
    existingFaculty.setEmail("faculty@test.com");
    existingFaculty.setFirstName("OldFirst");
    existingFaculty.setLastName("OldLast");

    Faculty updatedFaculty = new Faculty();
    updatedFaculty.setId(1);
    updatedFaculty.setFirstName("UpdatedFirst");
    updatedFaculty.setLastName("UpdatedLast");

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(facultyService.existsByEmail("faculty@test.com")).thenReturn(true);
    when(facultyService.getFacultyByEmail("faculty@test.com")).thenReturn(existingFaculty);
    when(departmentService.getDepartmentByName("Computer Science"))
        .thenReturn(Optional.of(new Department("Computer Science")));
    when(facultyService.saveFaculty(existingFaculty)).thenReturn(updatedFaculty);

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setFacultyProfile(updatedFacultyProto)
            .build();

    EditProfileResponse actualResponse = facultyProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setEditedFaculty(updatedFacultyProto)
            .build();

    assertEquals(expectedResponse, actualResponse);
  }


  @Test
  void testEditProfile_emptyDepartmentList_returnsErrorResponse() {
    FacultyProto updatedFacultyProto =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .build(); // No departments added

    Faculty existingFaculty = new Faculty();
    existingFaculty.setEmail("faculty@test.com");

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(facultyService.existsByEmail("faculty@test.com")).thenReturn(true);
    when(facultyService.getFacultyByEmail("faculty@test.com")).thenReturn(existingFaculty);

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setFacultyProfile(updatedFacultyProto)
            .build();

    EditProfileResponse actualResponse = facultyProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("A faculty member must belong to at least one department.")
            .build();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void testEditProfile_departmentNotFound_returnsErrorResponse() {
    FacultyProto updatedFacultyProto =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Nonexistent Department")
            .build();

    Faculty existingFaculty = new Faculty();
    existingFaculty.setEmail("faculty@test.com");

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(facultyService.existsByEmail("faculty@test.com")).thenReturn(true);
    when(facultyService.getFacultyByEmail("faculty@test.com")).thenReturn(existingFaculty);
    when(departmentService.getDepartmentByName("Nonexistent Department"))
        .thenReturn(Optional.empty());

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setFacultyProfile(updatedFacultyProto)
            .build();

    EditProfileResponse actualResponse = facultyProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Department not found: Nonexistent Department")
            .build();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void testEditProfile_facultyNotFound_returnsErrorResponse() {
    FacultyProto updatedFacultyProto =
        FacultyProto.newBuilder()
            .setFirstName("UpdatedFirst")
            .setLastName("UpdatedLast")
            .setEmail("faculty@test.com")
            .addDepartments("Computer Science")
            .build();

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(facultyService.existsByEmail("faculty@test.com")).thenReturn(false);

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setFacultyProfile(updatedFacultyProto)
            .build();

    EditProfileResponse actualResponse = facultyProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Could not find faculty with email: faculty@test.com")
            .build();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void testEditProfile_invalidUserRole_throwsException() {
    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("student@test.com")
            .setFacultyProfile(FacultyProto.newBuilder().setFirstName("Valid Faculty"))
            .build();

    when(userService.getUserRoleByEmail("student@test.com")).thenReturn(UserRole.STUDENT);

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              facultyProfileEditor.editProfile(request);
            });
    assertTrue(exception.getMessage().contains("User must be Faculty"));
  }

  @Test
  void testEditProfile_invalidRequest_throwsException() {
    EditProfileRequest request = EditProfileRequest.getDefaultInstance();
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              facultyProfileEditor.editProfile(request);
            });
    assertTrue(exception.getMessage().contains("EditProfile must contain 'faculty_profile'"));
  }
}
