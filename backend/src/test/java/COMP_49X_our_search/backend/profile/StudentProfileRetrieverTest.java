package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.Student;
import COMP_49X_our_search.backend.database.services.StudentService;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.StudentProto;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

public class StudentProfileRetrieverTest {

  private StudentService studentService;
  private StudentProfileRetriever studentProfileRetriever;

  @BeforeEach
  void setUp() {
    studentService = mock(StudentService.class);
    studentProfileRetriever = new StudentProfileRetriever(studentService);
  }

  @Test
  public void testRetrieveProfile_validEmail_returnsExpectedResult() {
    Student student = new Student();
    student.setId(1);
    student.setFirstName("First");
    student.setLastName("Last");
    student.setEmail("flast@test.com");
    student.setUndergradYear(3);
    student.setGraduationYear(2025);
    student.setInterestReason("Interested in AI");
    student.setHasPriorExperience(true);
    student.setIsActive(true);
    student.setMajors(Set.of(new Major("Computer Science", null, null, null)));
    student.setResearchFieldInterests(Set.of(new Major("Computer Science", null, null, null)));
    student.setResearchPeriods(Set.of(new ResearchPeriod("Fall 2025", null, null)));

    when(studentService.getStudentByEmail("flast@test.com")).thenReturn(student);

    RetrieveProfileRequest request =
        RetrieveProfileRequest.newBuilder().setUserEmail("flast@test.com").build();

    RetrieveProfileResponse response = studentProfileRetriever.retrieveProfile(request);

    StudentProto expectedProto = StudentProto.newBuilder()
        .setStudentId(1)
        .setFirstName("First")
        .setLastName("Last")
        .setEmail("flast@test.com")
        .setClassStatus("Junior")
        .setGraduationYear(2025)
        .addMajors("Computer Science")
        .addResearchFieldInterests("Computer Science")
        .addResearchPeriodsInterests("Fall 2025")
        .setInterestReason("Interested in AI")
        .setHasPriorExperience(true)
        .setIsActive(true)
        .build();

    assertTrue(response.getSuccess());
    assertEquals(1, response.getProfileId());
    assertThat(response.getRetrievedStudent()).isEqualTo(expectedProto);
  }

  @Test
  public void testRetrieveProfile_nonExistentEmail_throwsException() {
    String nonExistingEmail = "nonexistent@test.com";
    when(studentService.getStudentByEmail(nonExistingEmail)).thenThrow(
        new RuntimeException("Student not found with email: " + nonExistingEmail));

    RetrieveProfileRequest request = RetrieveProfileRequest.newBuilder()
        .setUserEmail(nonExistingEmail)
        .build();

    Exception exception = assertThrows(RuntimeException.class, () ->
        studentProfileRetriever.retrieveProfile(request));

    assertThat(exception.getMessage()).isEqualTo("Student not found with email: " + nonExistingEmail);
  }

  @Test
  public void testRetrieveProfile_emptyEmail_throwsException() {
    RetrieveProfileRequest request = RetrieveProfileRequest.newBuilder().setUserEmail("").build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class, () -> studentProfileRetriever.retrieveProfile(request));

    assertThat(exception.getMessage())
        .isEqualTo("RetrieveProfileRequest must contain 'user_email'");
  }
}
