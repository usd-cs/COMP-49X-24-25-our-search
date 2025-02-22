package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.DepartmentService;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.FacultyProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;

public class FacultyProfileCreatorTest {

  private FacultyService facultyService;
  private DepartmentService departmentService;
  private UserService userService;
  private FacultyProfileCreator facultyProfileCreator;

  @BeforeEach
  void setUp() {
    facultyService = mock(FacultyService.class);
    departmentService = mock(DepartmentService.class);
    userService = mock(UserService.class);
    facultyProfileCreator = new FacultyProfileCreator(facultyService, departmentService, userService);
  }

  @Test
  public void testCreateProfile_validFaculty_returnsExpectedResult() {
    FacultyProto validFaculty = FacultyProto.newBuilder()
        .setFirstName("John")
        .setLastName("Doe")
        .setEmail("johndoe@test.com")
        .addDepartments("Computer Science")
        .build();

    Department csDepartment = new Department();
    csDepartment.setName("Computer Science");

    when(departmentService.getDepartmentByName("Computer Science")).thenReturn(Optional.of(csDepartment));
    when(facultyService.existsByEmail("johndoe@test.com")).thenReturn(false);
    Faculty dbFaculty = new Faculty();
    dbFaculty.setId(1);
    dbFaculty.setFirstName(validFaculty.getFirstName());
    dbFaculty.setLastName(validFaculty.getLastName());
    dbFaculty.setEmail(validFaculty.getEmail());
    dbFaculty.setDepartments(Set.of(csDepartment));

    when(facultyService.saveFaculty(any())).thenReturn(dbFaculty);
    when(userService.createUser("johndoe@test.com", UserRole.FACULTY)).thenReturn(null);

    CreateProfileRequest request = CreateProfileRequest.newBuilder().setFacultyProfile(validFaculty).build();
    CreateProfileResponse response = facultyProfileCreator.createProfile(request);

    CreateProfileResponse expected = CreateProfileResponse.newBuilder()
        .setSuccess(true)
        .setProfileId(1)
        .setCreatedFaculty(validFaculty)
        .build();

    assertThat(response.toBuilder().build()).isEqualTo(expected.toBuilder().build());
  }

  @Test
  public void testCreateProfile_departmentNotFound_returnsExpectedResult() {
    FacultyProto facultyWithInvalidDepartment = FacultyProto.newBuilder()
        .setFirstName("Jane")
        .setLastName("Doe")
        .setEmail("janedoe@test.com")
        .addDepartments("Invalid Department")
        .build();

    when(departmentService.getDepartmentByName("Invalid Department")).thenReturn(Optional.empty());

    CreateProfileRequest request = CreateProfileRequest.newBuilder().setFacultyProfile(facultyWithInvalidDepartment).build();
    CreateProfileResponse actualResponse = facultyProfileCreator.createProfile(request);

    CreateProfileResponse expectedResponse = CreateProfileResponse.newBuilder()
        .setSuccess(false)
        .setErrorMessage("Department not found: Invalid Department")
        .build();

    assertThat(actualResponse.toBuilder().build()).isEqualTo(expectedResponse.toBuilder().build());
  }

  @Test
  public void testCreateProfile_facultyAlreadyExists_returnsExpectedResult() {
    FacultyProto duplicateFaculty = FacultyProto.newBuilder()
        .setFirstName("John")
        .setLastName("Doe")
        .setEmail("johndoe@test.com")
        .addDepartments("Computer Science")
        .build();

    when(facultyService.existsByEmail("johndoe@test.com")).thenReturn(true);

    CreateProfileRequest request = CreateProfileRequest.newBuilder().setFacultyProfile(duplicateFaculty).build();
    CreateProfileResponse actualResponse = facultyProfileCreator.createProfile(request);

    CreateProfileResponse expectedResponse = CreateProfileResponse.newBuilder()
        .setSuccess(false)
        .setErrorMessage("A faculty member with this email already exists.")
        .build();

    assertThat(actualResponse.toBuilder().build()).isEqualTo(expectedResponse.toBuilder().build());
  }

  @Test
  public void testCreateProfile_invalidFacultyData_throwsException() {
    FacultyProto invalidFaculty = FacultyProto.newBuilder()
        .setFirstName("John")
        .setLastName("")
        .setEmail("john@test.com")
        .build();

    CreateProfileRequest request = CreateProfileRequest.newBuilder().setFacultyProfile(invalidFaculty).build();
    Exception exception = assertThrows(IllegalArgumentException.class, () -> facultyProfileCreator.createProfile(request));

    assertTrue(exception.getMessage().contains("FacultyProto must have valid following fields: first_name, last_name, email, departments"));
  }

  @Test
  public void testCreateProfile_invalidRequest_throwsException() {
    CreateProfileRequest request = CreateProfileRequest.getDefaultInstance();
    Exception exception = assertThrows(IllegalArgumentException.class, () -> facultyProfileCreator.createProfile(request));

    assertTrue(exception.getMessage().contains("CreateProfileRequest must contain 'faculty_profile'"));
  }
}
