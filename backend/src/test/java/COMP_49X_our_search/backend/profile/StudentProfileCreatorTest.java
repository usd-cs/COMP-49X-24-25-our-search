package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.MajorService;
import COMP_49X_our_search.backend.database.services.ResearchPeriodService;
import COMP_49X_our_search.backend.database.services.StudentService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.CreateProfileRequest;
import proto.profile.ProfileModule.CreateProfileResponse;

public class StudentProfileCreatorTest {

  private StudentService studentService;

  private MajorService majorService;

  private ResearchPeriodService researchPeriodService;
  private UserService userService;
  private StudentProfileCreator studentProfileCreator;

  @BeforeEach
  void setUp() {
    studentService = mock(StudentService.class);
    majorService = mock(MajorService.class);
    researchPeriodService = mock(ResearchPeriodService.class);
    userService = mock(UserService.class);
    studentProfileCreator =
        new StudentProfileCreator(studentService, majorService, researchPeriodService, userService);
  }

  @Test
  public void testCreateProfile_validStudent_returnsExpectedResult() {
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

    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(computerScience));
    when(researchPeriodService.getResearchPeriodByName("Fall 2025")).thenReturn(Optional.of(fall2025));

    Student dbStudent = new Student();
    dbStudent.setId(1);
    dbStudent.setFirstName(validStudent.getFirstName());
    dbStudent.setLastName(validStudent.getLastName());
    dbStudent.setEmail(validStudent.getEmail());
    dbStudent.setGraduationYear(validStudent.getGraduationYear());
    dbStudent.setMajors(Set.of(computerScience));
    dbStudent.setResearchFieldInterests(Set.of(computerScience));
    dbStudent.setResearchPeriods(Set.of(fall2025));
    dbStudent.setInterestReason(validStudent.getInterestReason());
    dbStudent.setHasPriorExperience(validStudent.getHasPriorExperience());
    dbStudent.setIsActive(validStudent.getIsActive());

    when(studentService.saveStudent(any())).thenReturn(dbStudent);

    CreateProfileRequest request = CreateProfileRequest.newBuilder()
        .setStudentProfile(validStudent).build();
    CreateProfileResponse response = studentProfileCreator.createProfile(request);

    CreateProfileResponse expected = CreateProfileResponse.newBuilder()
        .setSuccess(true)
        .setProfileId(1)
        .setCreatedStudent(validStudent)
        .build();

    assertThat(response.toBuilder().build()).isEqualTo(expected.toBuilder().build());
  }

  @Test
  public void testCreateProfile_validStudentPeriodNotFound_returnsExpectedResult() {
    StudentProto validStudentWithInvalidMajor =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Computer Science")
            .addResearchPeriodsInterests("Invalid Period")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    Major computerScience = new Major();
    computerScience.setName("Computer Science");

    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(computerScience));
    when(researchPeriodService.getResearchPeriodByName("Invalid Period")).thenReturn(Optional.empty());

    CreateProfileRequest request =
        CreateProfileRequest.newBuilder().setStudentProfile(validStudentWithInvalidMajor).build();

    CreateProfileResponse actualResponse = studentProfileCreator.createProfile(request);

    CreateProfileResponse expectedResponse =
        CreateProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Research period not found: Invalid Period")
            .build();

    assertThat(actualResponse.toBuilder().build()).isEqualTo(expectedResponse.toBuilder().build());
  }

  @Test
  public void testCreateProfile_validStudentResearchFieldNotFound_returnsExpectedResult() {
    StudentProto validStudentWithInvalidResearchField =
        StudentProto.newBuilder()
            .setFirstName("First")
            .setLastName("Last")
            .setEmail("flast@test.com")
            .setClassStatus("Senior")
            .setGraduationYear(2025)
            .addMajors("Computer Science")
            .addResearchFieldInterests("Invalid Research Field")
            .addResearchPeriodsInterests("Fall 2025")
            .setInterestReason("Test reason")
            .setHasPriorExperience(true)
            .setIsActive(true)
            .build();

    Major computerScience = new Major();
    computerScience.setName("Computer Science");

    when(majorService.getMajorByName("Computer Science")).thenReturn(Optional.of(computerScience));
    when(majorService.getMajorByName("Invalid Research Field")).thenReturn(Optional.empty());

    CreateProfileRequest request =
        CreateProfileRequest.newBuilder().setStudentProfile(validStudentWithInvalidResearchField).build();

    CreateProfileResponse actualResponse = studentProfileCreator.createProfile(request);

    CreateProfileResponse expectedResponse =
        CreateProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Research field (Major) not found: Invalid Research Field")
            .build();

    assertThat(actualResponse.toBuilder().build()).isEqualTo(expectedResponse.toBuilder().build());
  }

  @Test
  public void testCreateProfile_validStudentMajorNotFound_returnsExpectedResult() {
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

    when(majorService.getMajorByName("Invalid Major")).thenReturn(Optional.empty());

    CreateProfileRequest request =
        CreateProfileRequest.newBuilder().setStudentProfile(validStudentWithInvalidMajor).build();

    CreateProfileResponse actualResponse = studentProfileCreator.createProfile(request);

    CreateProfileResponse expectedResponse =
        CreateProfileResponse.newBuilder()
            .setSuccess(false)
            .setErrorMessage("Major not found: Invalid Major")
            .build();

    assertThat(actualResponse.toBuilder().build()).isEqualTo(expectedResponse.toBuilder().build());
  }

  @Test
  public void testCreateProfile_invalidStudentData_throwsException() {

    // Creating student with some valid data, but some invalid, i.e. missing
    // fields.
    StudentProto studentWithInvalidData =
        StudentProto.newBuilder()
            .setFirstName("Valid name")
            .setLastName("Valid last name")
            .setEmail("test@test.com")
            .build();

    when(studentService.existsByEmail("test@test.com")).thenReturn(false);

    CreateProfileRequest request =
        CreateProfileRequest.newBuilder().setStudentProfile(studentWithInvalidData).build();
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentProfileCreator.createProfile(request);
            });
    assertTrue(
        exception
            .getMessage()
            .contains(
                "StudentProto must have valid following fields: "
                    + "first_name, last_name, class_status, interest_reason, majors, "
                    + "research_field_interests, research_periods_interests"));
  }

  @Test
  public void testCreateProfile_invalidRequest_throwsException() {
    CreateProfileRequest request = CreateProfileRequest.getDefaultInstance();
    Exception exception =
        assertThrows(
            IllegalArgumentException.class,
            () -> {
              studentProfileCreator.createProfile(request);
            });
    assertTrue(
        exception.getMessage().contains("CreateProfileRequest must contain 'student_profile'"));
  }
}
