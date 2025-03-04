package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.EditProfileRequest;
import proto.profile.ProfileModule.EditProfileResponse;

public class StudentProfileEditorTest {
  private StudentService studentService;
  private MajorService majorService;
  private ResearchPeriodService researchPeriodService;
  private UserService userService;
  private StudentProfileEditor studentProfileEditor;

  @BeforeEach
  void setUp() {
    studentService = mock(StudentService.class);
    majorService = mock(MajorService.class);
    researchPeriodService = mock(ResearchPeriodService.class);
    userService = mock(UserService.class);
    studentProfileEditor =
        new StudentProfileEditor(studentService, majorService, researchPeriodService, userService);
  }

  @Test
  void testEditProfile_validStudent_returnsExpectedResult() {
    StudentProto validStudent =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    Major computerScience = new Major();
    computerScience.setName("Computer Science");

    ResearchPeriod fall2025 = new ResearchPeriod();
    fall2025.setName("Fall 2025");

    Student dbStudent = new Student();
    dbStudent.setId(1);
    dbStudent.setFirstName("OldFirst");
    dbStudent.setLastName("OldLast");
    dbStudent.setEmail("flast@test.com");
    dbStudent.setGraduationYear(2023);
    dbStudent.setMajors(Set.of());
    dbStudent.setResearchFieldInterests(Set.of());
    dbStudent.setResearchPeriods(Set.of());
    dbStudent.setInterestReason("Old reason");
    dbStudent.setHasPriorExperience(false);
    dbStudent.setIsActive(false);

    when(userService.getUserRoleByEmail("flast@test.com")).thenReturn(UserRole.STUDENT);
    when(studentService.existsByEmail("flast@test.com")).thenReturn(true);
    when(studentService.getStudentByEmail("flast@test.com")).thenReturn(dbStudent);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(computerScience));
    when(researchPeriodService.getResearchPeriodByName("Fall 2025")).thenReturn(Optional.of(fall2025));
    when(studentService.saveStudent(any())).thenReturn(dbStudent);

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("flast@test.com")
            .setStudentProfile(validStudent)
            .build();

    EditProfileResponse response = studentProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(true)
            .setProfileId(1)
            .setEditedStudent(validStudent)
            .build();

    assertThat(response).isEqualTo(expectedResponse);
  }

  @Test
  public void testEditProfile_validStudentProfileMajorNotFound_returnsExpectedResult() {
    StudentProto validStudentWithInvalidMajor =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Invalid Major")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    Student dbStudent = new Student();
    dbStudent.setEmail("flast@test.com");

    when(userService.getUserRoleByEmail("flast@test.com")).thenReturn(UserRole.STUDENT);
    when(studentService.existsByEmail("flast@test.com")).thenReturn(true);
    when(studentService.getStudentByEmail("flast@test.com")).thenReturn(dbStudent);
    when(majorService.getMajorByName("Invalid Major")).thenReturn(Optional.empty()); // Simulate missing major

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("flast@test.com")
            .setStudentProfile(validStudentWithInvalidMajor)
            .build();

    EditProfileResponse actualResponse = studentProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Major not found: Invalid Major")
            .build();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void testEditProfile_validStudentProfilePeriodNotFound_returnsExpectedResult() {
    StudentProto validStudentWithInvalidResearchPeriod =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Invalid Research Period")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    Student dbStudent = new Student();
    dbStudent.setEmail("flast@test.com");

    when(userService.getUserRoleByEmail("flast@test.com")).thenReturn(UserRole.STUDENT);
    when(studentService.existsByEmail("flast@test.com")).thenReturn(true);
    when(studentService.getStudentByEmail("flast@test.com")).thenReturn(dbStudent);
    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(new Major("Computer Science", null, null, null)));
    when(researchPeriodService.getResearchPeriodByName("Invalid Research Period")).thenReturn(Optional.empty()); // Simulate missing research period

    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("flast@test.com")
            .setStudentProfile(validStudentWithInvalidResearchPeriod)
            .build();

    EditProfileResponse actualResponse = studentProfileEditor.editProfile(request);

    EditProfileResponse expectedResponse =
        EditProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Research period not found: Invalid Research Period")
            .build();

    assertThat(actualResponse).isEqualTo(expectedResponse);
  }

  @Test
  public void testEditProfile_invalidUserRole_throwsException() {
    EditProfileRequest request =
        EditProfileRequest.newBuilder()
            .setUserEmail("faculty@test.com")
            .setStudentProfile(StudentProto.newBuilder().setFirstName("Valid proto student"))
            .build();

    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);

    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentProfileEditor.editProfile(request);
            });
    assertTrue(exception.getMessage().contains("User must be a Student"));
  }

  @Test
  public void testEditProfile_invalidRequest_throwsException() {
    EditProfileRequest request = EditProfileRequest.getDefaultInstance();
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentProfileEditor.editProfile(request);
            });
    assertTrue(
        exception.getMessage().contains("EditProfileRequest must contain 'student_profile'"));
  }
}
