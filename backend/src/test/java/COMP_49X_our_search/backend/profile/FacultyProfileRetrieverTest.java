package COMP_49X_our_search.backend.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import COMP_49X_our_search.backend.database.entities.Department;
import COMP_49X_our_search.backend.database.entities.Faculty;
import COMP_49X_our_search.backend.database.entities.Major;
import COMP_49X_our_search.backend.database.entities.Project;
import COMP_49X_our_search.backend.database.entities.ResearchPeriod;
import COMP_49X_our_search.backend.database.entities.UmbrellaTopic;
import COMP_49X_our_search.backend.database.enums.UserRole;
import COMP_49X_our_search.backend.database.services.FacultyService;
import COMP_49X_our_search.backend.database.services.ProjectService;
import COMP_49X_our_search.backend.database.services.UserService;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import proto.data.Entities.FacultyProto;
import proto.data.Entities.ProjectProto;
import proto.profile.ProfileModule.FacultyProfile;
import proto.profile.ProfileModule.RetrieveProfileRequest;
import proto.profile.ProfileModule.RetrieveProfileResponse;

public class FacultyProfileRetrieverTest {

  private FacultyService facultyService;
  private UserService userService;
  private ProjectService projectService;
  private FacultyProfileRetriever facultyProfileRetriever;

  @BeforeEach
  void setUp() {
    facultyService = mock(FacultyService.class);
    userService = mock(UserService.class);
    projectService = mock(ProjectService.class);
    facultyProfileRetriever =
        new FacultyProfileRetriever(facultyService, userService, projectService);
  }

  @Test
  public void testRetrieveProfile_validEmail_returnsExpectedResult() {
    Faculty faculty = new Faculty();
    faculty.setId(1);
    faculty.setFirstName("Faculty");
    faculty.setLastName("Member");
    faculty.setEmail("faculty@test.com");
    faculty.setDepartments(Set.of(new Department("Life and Physical Sciences")));

    Project project = new Project();
    project.setId(1);
    project.setName("Test name");
    project.setDescription("Test description");
    project.setDesiredQualifications("Test qualifications");
    project.setIsActive(true);
    project.setMajors(Set.of(new Major("Chemistry", null, null, null)));
    project.setResearchPeriods(Set.of(new ResearchPeriod("Fall 2025", null, null)));
    project.setUmbrellaTopics(Set.of(new UmbrellaTopic("Artificial Intelligence", null)));
    project.setFaculty(faculty);

    when(facultyService.getFacultyByEmail("faculty@test.com")).thenReturn(faculty);
    when(userService.getUserRoleByEmail("faculty@test.com")).thenReturn(UserRole.FACULTY);
    when(projectService.getProjectsByFacultyId(1)).thenReturn(List.of(project));

    RetrieveProfileRequest request =
        RetrieveProfileRequest.newBuilder().setUserEmail("faculty@test.com").build();

    RetrieveProfileResponse response = facultyProfileRetriever.retrieveProfile(request);

    FacultyProto expectedFacultyProto =
        FacultyProto.newBuilder()
            .setFacultyId(1)
            .setFirstName("Faculty")
            .setLastName("Member")
            .setEmail("faculty@test.com")
            .addDepartments("Life and Physical Sciences")
            .build();

    ProjectProto expectedProjectProto =
        ProjectProto.newBuilder()
            .setProjectId(1)
            .setProjectName("Test name")
            .setDescription("Test description")
            .setDesiredQualifications("Test qualifications")
            .setIsActive(true)
            .addAllMajors(List.of("Chemistry"))
            .addAllResearchPeriods(List.of("Fall 2025"))
            .addAllUmbrellaTopics(List.of("Artificial Intelligence"))
            .setFaculty(expectedFacultyProto)
            .build();

    assertTrue(response.getSuccess());
    assertEquals(1, response.getProfileId());
    assertThat(response.getRetrievedFaculty().getFaculty().getFirstName()).isEqualTo("Faculty");
    assertThat(response.getRetrievedFaculty().getFaculty().getLastName()).isEqualTo("Member");
    assertThat(response.getRetrievedFaculty().getFaculty().getEmail()).isEqualTo("faculty@test.com");
    assertThat(response.getRetrievedFaculty().getFaculty().getDepartmentsList()).containsExactly("Life and Physical Sciences");
    assertThat(response.getRetrievedFaculty().getProjectsList())
        .containsExactly(expectedProjectProto);
  }

  @Test
  public void testRetrieveProfile_nonExistentEmail_returnsErrorResponse() {
    String nonExistingEmail = "nonexistent@test.com";
    when(facultyService.getFacultyByEmail(nonExistingEmail)).thenReturn(null);
    when(userService.getUserRoleByEmail(nonExistingEmail)).thenReturn(UserRole.FACULTY);

    RetrieveProfileRequest request =
        RetrieveProfileRequest.newBuilder().setUserEmail(nonExistingEmail).build();

    RetrieveProfileResponse response = facultyProfileRetriever.retrieveProfile(request);

    assertThat(response.getSuccess()).isFalse();
    assertThat(response.getErrorMessage())
        .isEqualTo("Faculty profile not found for email: " + nonExistingEmail);
  }

  @Test
  public void testRetrieveProfile_userIsNotFaculty_returnsUnauthorizedError() {
    String studentEmail = "student@test.com";
    when(userService.getUserRoleByEmail(studentEmail)).thenReturn(UserRole.STUDENT);

    RetrieveProfileRequest request =
        RetrieveProfileRequest.newBuilder().setUserEmail(studentEmail).build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class, () -> facultyProfileRetriever.retrieveProfile(request));

    assertThat(exception.getMessage()).isEqualTo("User must be a Faculty");
  }

  @Test
  public void testRetrieveProfile_emptyEmail_throwsException() {
    RetrieveProfileRequest request = RetrieveProfileRequest.newBuilder().setUserEmail("").build();

    Exception exception =
        assertThrows(
            IllegalArgumentException.class, () -> facultyProfileRetriever.retrieveProfile(request));

    assertThat(exception.getMessage())
        .isEqualTo("RetrieveProfileRequest must contain 'user_email'");
  }
}
